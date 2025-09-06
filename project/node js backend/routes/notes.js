const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authenticateToken, canAccessCandidate } = require('../middleware/auth');
const { validateNoteCreation, validateCandidateId, validateNoteId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/notes/candidate/:candidateId
// @desc    Get all notes for a candidate
// @access  Private
router.get('/candidate/:candidateId', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = { candidateId: req.params.candidateId };
    
    // Filter by type if specified
    if (type) {
      query.type = type;
    }

    // Don't show private notes unless user is the author
    query.$or = [
      { isPrivate: false },
      { author: req.user._id }
    ];

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await Note.find(query)
      .populate('author', 'name email profilePicture role')
      .populate('mentions.user', 'name email')
      .sort(sort)
      .limit(limitNum)
      .skip(skip);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalNotes: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      error: 'Failed to fetch notes'
    });
  }
});

// @route   GET /api/notes/:noteId
// @desc    Get single note
// @access  Private
router.get('/:noteId', authenticateToken, validateNoteId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId)
      .populate('author', 'name email profilePicture role')
      .populate('mentions.user', 'name email')
      .populate('candidateId', 'name email');

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Check if user can access this note
    const Candidate = require('../models/Candidate');
    const candidate = await Candidate.findById(note.candidateId);

    if (!candidate) {
      return res.status(404).json({
        error: 'Associated candidate not found'
      });
    }

    // Check access permissions
    const isCreator = candidate.createdBy.toString() === req.user._id.toString();
    const isAssigned = candidate.assignedTo.some(
      assignee => assignee.toString() === req.user._id.toString()
    );
    const isAuthor = note.author._id.toString() === req.user._id.toString();

    if (req.user.role !== 'admin' && !isCreator && !isAssigned && !isAuthor) {
      return res.status(403).json({
        error: 'You do not have access to this note'
      });
    }

    // Check if note is private and user is not the author
    if (note.isPrivate && !isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'This is a private note'
      });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      error: 'Failed to fetch note'
    });
  }
});

// @route   POST /api/notes/candidate/:candidateId
// @desc    Create new note for candidate
// @access  Private
router.post('/candidate/:candidateId', authenticateToken, validateCandidateId, canAccessCandidate, validateNoteCreation, async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      candidateId: req.params.candidateId,
      author: req.user._id
    };

    const note = new Note(noteData);
    await note.save();

    // Populate the note
    await note.populate('author', 'name email profilePicture role');
    await note.populate('mentions.user', 'name email');

    // Handle mentions and create notifications
    if (note.mentions && note.mentions.length > 0) {
      const candidate = req.candidate;
      
      for (const mention of note.mentions) {
        try {
          // Don't notify the author
          if (mention.user.toString() !== req.user._id.toString()) {
            await Notification.createMentionNotification({
              recipient: mention.user,
              sender: req.user,
              note,
              candidate
            });

            // Emit real-time notification
            if (req.io) {
              req.io.to(`user-${mention.user}`).emit('notification', {
                type: 'mention',
                message: `You were mentioned by ${req.user.name}`,
                candidateId: candidate._id,
                candidateName: candidate.name,
                noteId: note._id,
                notePreview: note.content.substring(0, 100)
              });
            }
          }
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }

    // Emit real-time note creation to candidate room
    if (req.io) {
      req.io.to(`candidate-${req.params.candidateId}`).emit('newNote', note);
    }

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      error: 'Failed to create note'
    });
  }
});

// @route   PUT /api/notes/:noteId
// @desc    Update note
// @access  Private
router.put('/:noteId', authenticateToken, validateNoteId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Only author can edit their note (or admin)
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only edit your own notes'
      });
    }

    const { content, type, isPrivate, priority } = req.body;

    // Update fields
    if (content !== undefined) {
      note.content = content;
      note.isEdited = true;
      note.editedAt = new Date();
    }
    if (type) note.type = type;
    if (isPrivate !== undefined) note.isPrivate = isPrivate;
    if (priority) note.priority = priority;

    await note.save();
    await note.populate('author', 'name email profilePicture role');
    await note.populate('mentions.user', 'name email');

    // Emit real-time note update
    if (req.io) {
      req.io.to(`candidate-${note.candidateId}`).emit('noteUpdated', note);
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      error: 'Failed to update note'
    });
  }
});

// @route   DELETE /api/notes/:noteId
// @desc    Delete note
// @access  Private
router.delete('/:noteId', authenticateToken, validateNoteId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Only author can delete their note (or admin)
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only delete your own notes'
      });
    }

    await Note.findByIdAndDelete(req.params.noteId);

    // Delete related notifications
    await Notification.deleteMany({ relatedNote: req.params.noteId });

    // Emit real-time note deletion
    if (req.io) {
      req.io.to(`candidate-${note.candidateId}`).emit('noteDeleted', {
        noteId: req.params.noteId
      });
    }

    res.json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      error: 'Failed to delete note'
    });
  }
});

// @route   POST /api/notes/:noteId/reaction
// @desc    Add or update reaction to note
// @access  Private
router.post('/:noteId/reaction', authenticateToken, validateNoteId, async (req, res) => {
  try {
    const { type } = req.body;

    if (!['like', 'agree', 'disagree', 'question'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid reaction type'
      });
    }

    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Check if user already reacted
    const existingReactionIndex = note.reactions.findIndex(
      reaction => reaction.user.toString() === req.user._id.toString()
    );

    if (existingReactionIndex > -1) {
      // Update existing reaction
      note.reactions[existingReactionIndex].type = type;
      note.reactions[existingReactionIndex].createdAt = new Date();
    } else {
      // Add new reaction
      note.reactions.push({
        user: req.user._id,
        type,
        createdAt: new Date()
      });
    }

    await note.save();
    await note.populate('reactions.user', 'name email');

    // Emit real-time reaction update
    if (req.io) {
      req.io.to(`candidate-${note.candidateId}`).emit('noteReactionUpdated', {
        noteId: note._id,
        reactions: note.reactions
      });
    }

    res.json({
      message: 'Reaction updated successfully',
      reactions: note.reactions
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      error: 'Failed to add reaction'
    });
  }
});

// @route   DELETE /api/notes/:noteId/reaction
// @desc    Remove reaction from note
// @access  Private
router.delete('/:noteId/reaction', authenticateToken, validateNoteId, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    // Remove user's reaction
    note.reactions = note.reactions.filter(
      reaction => reaction.user.toString() !== req.user._id.toString()
    );

    await note.save();
    await note.populate('reactions.user', 'name email');

    // Emit real-time reaction update
    if (req.io) {
      req.io.to(`candidate-${note.candidateId}`).emit('noteReactionUpdated', {
        noteId: note._id,
        reactions: note.reactions
      });
    }

    res.json({
      message: 'Reaction removed successfully',
      reactions: note.reactions
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      error: 'Failed to remove reaction'
    });
  }
});

// @route   GET /api/notes/search
// @desc    Search notes
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, candidateId, type, author, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters long'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {
      content: { $regex: q.trim(), $options: 'i' }
    };

    // Filter by candidate
    if (candidateId) {
      query.candidateId = candidateId;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Don't show private notes unless user is the author
    query.$or = [
      { isPrivate: false },
      { author: req.user._id }
    ];

    const notes = await Note.find(query)
      .populate('author', 'name email profilePicture')
      .populate('candidateId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalResults: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      query: q
    });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({
      error: 'Failed to search notes'
    });
  }
});

module.exports = router;