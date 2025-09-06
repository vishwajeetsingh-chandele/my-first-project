const express = require('express');
const Candidate = require('../models/Candidate');
const Note = require('../models/Note');
const { authenticateToken, canAccessCandidate } = require('../middleware/auth');
const { validateCandidateCreation, validateCandidateId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/candidates
// @desc    Get all candidates for authenticated user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    
    // Admin can see all candidates, others see only their own or assigned
    if (req.user.role !== 'admin') {
      query.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Only active candidates
    query.isActive = true;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const candidates = await Candidate.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .limit(limitNum)
      .skip(skip);

    const total = await Candidate.countDocuments(query);

    res.json({
      candidates,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCandidates: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidates'
    });
  }
});

// @route   GET /api/candidates/:id
// @desc    Get single candidate
// @access  Private
router.get('/:id', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        error: 'Candidate not found'
      });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate'
    });
  }
});

// @route   POST /api/candidates
// @desc    Create new candidate
// @access  Private
router.post('/', authenticateToken, validateCandidateCreation, async (req, res) => {
  console.log(req.body);
  try {
    const candidateData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Check if candidate with same email already exists
    const existingCandidate = await Candidate.findOne({ 
      email: candidateData.email,
      isActive: true 
    });

    if (existingCandidate) {
      return res.status(400).json({
        error: 'Candidate with this email already exists'
      });
    }

    const candidate = new Candidate(candidateData);
    await candidate.save();

    // Populate the response
    await candidate.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      error: 'Failed to create candidate'
    });
  }
});

// @route   PUT /api/candidates/:id
// @desc    Update candidate
// @access  Private
router.put('/:id', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const { name, email, phone, position, status, source, skills, experience, salary, tags } = req.body;
    
    const candidate = req.candidate;

    // Update fields if provided
    if (name) candidate.name = name;
    if (email) {
      // Check if new email already exists for another candidate
      const existingCandidate = await Candidate.findOne({ 
        email,
        _id: { $ne: candidate._id },
        isActive: true 
      });
      
      if (existingCandidate) {
        return res.status(400).json({
          error: 'Another candidate with this email already exists'
        });
      }
      
      candidate.email = email;
    }
    if (phone !== undefined) candidate.phone = phone;
    if (position !== undefined) candidate.position = position;
    if (status) candidate.status = status;
    if (source !== undefined) candidate.source = source;
    if (skills) candidate.skills = skills;
    if (experience !== undefined) candidate.experience = experience;
    if (salary) candidate.salary = { ...candidate.salary, ...salary };
    if (tags) candidate.tags = tags;

    await candidate.save();
    await candidate.populate('createdBy assignedTo', 'name email role');

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      error: 'Failed to update candidate'
    });
  }
});

// @route   DELETE /api/candidates/:id
// @desc    Soft delete candidate
// @access  Private
router.delete('/:id', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const candidate = req.candidate;

    // Soft delete - mark as inactive
    candidate.isActive = false;
    await candidate.save();

    res.json({
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      error: 'Failed to delete candidate'
    });
  }
});

// @route   POST /api/candidates/:id/assign
// @desc    Assign users to candidate
// @access  Private
router.post('/:id/assign', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: 'userIds must be a non-empty array'
      });
    }

    const candidate = req.candidate;
    const User = require('../models/User');

    // Verify all users exist
    const users = await User.find({ _id: { $in: userIds }, isActive: true });
    
    if (users.length !== userIds.length) {
      return res.status(400).json({
        error: 'Some users not found or inactive'
      });
    }

    // Add users to assignedTo array (avoiding duplicates)
    const currentAssignedIds = candidate.assignedTo.map(id => id.toString());
    const newAssignedIds = userIds.filter(id => !currentAssignedIds.includes(id));
    
    candidate.assignedTo.push(...newAssignedIds);
    await candidate.save();
    
    await candidate.populate('assignedTo', 'name email role');

    res.json({
      message: 'Users assigned successfully',
      assignedUsers: candidate.assignedTo
    });
  } catch (error) {
    console.error('Assign users error:', error);
    res.status(500).json({
      error: 'Failed to assign users'
    });
  }
});

// @route   DELETE /api/candidates/:id/assign/:userId
// @desc    Remove user assignment from candidate
// @access  Private
router.delete('/:id/assign/:userId', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const { userId } = req.params;
    const candidate = req.candidate;

    // Remove user from assignedTo array
    candidate.assignedTo = candidate.assignedTo.filter(
      assignedId => assignedId.toString() !== userId
    );

    await candidate.save();
    await candidate.populate('assignedTo', 'name email role');

    res.json({
      message: 'User assignment removed successfully',
      assignedUsers: candidate.assignedTo
    });
  } catch (error) {
    console.error('Remove assignment error:', error);
    res.status(500).json({
      error: 'Failed to remove user assignment'
    });
  }
});

// @route   GET /api/candidates/:id/stats
// @desc    Get candidate statistics
// @access  Private
router.get('/:id/stats', authenticateToken, validateCandidateId, canAccessCandidate, async (req, res) => {
  try {
    const candidateId = req.params.id;

    // Get notes count
    const notesCount = await Note.countDocuments({ candidateId });
    
    // Get notes by type
    const notesByType = await Note.aggregate([
      { $match: { candidateId: candidateId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Note.countDocuments({
      candidateId,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalNotes: notesCount,
      notesByType: notesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentActivity
    });
  } catch (error) {
    console.error('Get candidate stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate statistics'
    });
  }
});

module.exports = router;