const Candidate = require('../models/Candidate');
const Note = require('../models/Note');
const User = require('../models/User');
const Notification = require('../models/Notification');

const socketHandlers = (socket, io) => {
  console.log(`Socket handlers initialized for user ${socket.userId}`);

  // Join candidate room
  socket.on('joinCandidateRoom', async (data) => {
    try {
      const { candidateId } = data;

      if (!candidateId) {
        socket.emit('error', { message: 'Candidate ID is required' });
        return;
      }

      // Verify user has access to this candidate
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        socket.emit('error', { message: 'Candidate not found' });
        return;
      }

      const user = socket.user;
      const isCreator = candidate.createdBy.toString() === user._id.toString();
      const isAssigned = candidate.assignedTo.some(
        assignee => assignee.toString() === user._id.toString()
      );

      if (user.role !== 'admin' && !isCreator && !isAssigned) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Join the candidate room
      socket.join(`candidate-${candidateId}`);
      
      // Notify others in the room that user joined
      socket.to(`candidate-${candidateId}`).emit('userJoinedRoom', {
        userId: user._id,
        userName: user.name,
        candidateId
      });

      socket.emit('joinedCandidateRoom', {
        candidateId,
        message: `Joined candidate room successfully`
      });

      console.log(`User ${user.name} joined candidate room: ${candidateId}`);
    } catch (error) {
      console.error('Join candidate room error:', error);
      socket.emit('error', { message: 'Failed to join candidate room' });
    }
  });

  // Leave candidate room
  socket.on('leaveCandidateRoom', (data) => {
    try {
      const { candidateId } = data;

      if (candidateId) {
        socket.leave(`candidate-${candidateId}`);
        
        // Notify others in the room that user left
        socket.to(`candidate-${candidateId}`).emit('userLeftRoom', {
          userId: socket.userId,
          userName: socket.user.name,
          candidateId
        });

        socket.emit('leftCandidateRoom', { candidateId });
        console.log(`User ${socket.user.name} left candidate room: ${candidateId}`);
      }
    } catch (error) {
      console.error('Leave candidate room error:', error);
    }
  });

  // Real-time note creation
  socket.on('createNote', async (data) => {
    try {
      const { candidateId, content, type = 'note', isPrivate = false, priority = 'normal' } = data;

      if (!candidateId || !content) {
        socket.emit('error', { message: 'Candidate ID and content are required' });
        return;
      }

      // Verify access to candidate
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        socket.emit('error', { message: 'Candidate not found' });
        return;
      }

      const user = socket.user;
      const isCreator = candidate.createdBy.toString() === user._id.toString();
      const isAssigned = candidate.assignedTo.some(
        assignee => assignee.toString() === user._id.toString()
      );

      if (user.role !== 'admin' && !isCreator && !isAssigned) {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Create note
      const note = new Note({
        candidateId,
        author: user._id,
        content: content.trim(),
        type,
        isPrivate,
        priority
      });

      await note.save();
      await note.populate('author', 'name email profilePicture role');
      await note.populate('mentions.user', 'name email');

      // Handle mentions and create notifications
      if (note.mentions && note.mentions.length > 0) {
        for (const mention of note.mentions) {
          try {
            if (mention.user.toString() !== user._id.toString()) {
              await Notification.createMentionNotification({
                recipient: mention.user,
                sender: user,
                note,
                candidate
              });

              // Send real-time notification to mentioned user
              io.to(`user-${mention.user}`).emit('notification', {
                type: 'mention',
                title: `You were mentioned by ${user.name}`,
                message: `${user.name} mentioned you in a note about ${candidate.name}`,
                candidateId: candidate._id,
                candidateName: candidate.name,
                noteId: note._id,
                notePreview: note.content.substring(0, 100)
              });
            }
          } catch (notificationError) {
            console.error('Error creating mention notification:', notificationError);
          }
        }
      }

      // Emit to all users in the candidate room
      io.to(`candidate-${candidateId}`).emit('newNote', note);

      console.log(`Note created by ${user.name} for candidate ${candidateId}`);
    } catch (error) {
      console.error('Create note error:', error);
      socket.emit('error', { message: 'Failed to create note' });
    }
  });

  // Real-time note update
  socket.on('updateNote', async (data) => {
    try {
      const { noteId, content, type, isPrivate, priority } = data;

      if (!noteId) {
        socket.emit('error', { message: 'Note ID is required' });
        return;
      }

      const note = await Note.findById(noteId);
      if (!note) {
        socket.emit('error', { message: 'Note not found' });
        return;
      }

      // Only author can edit (or admin)
      if (note.author.toString() !== socket.userId && socket.user.role !== 'admin') {
        socket.emit('error', { message: 'You can only edit your own notes' });
        return;
      }

      // Update note
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

      // Emit to all users in the candidate room
      io.to(`candidate-${note.candidateId}`).emit('noteUpdated', note);

      console.log(`Note ${noteId} updated by ${socket.user.name}`);
    } catch (error) {
      console.error('Update note error:', error);
      socket.emit('error', { message: 'Failed to update note' });
    }
  });

  // Real-time note deletion
  socket.on('deleteNote', async (data) => {
    try {
      const { noteId } = data;

      if (!noteId) {
        socket.emit('error', { message: 'Note ID is required' });
        return;
      }

      const note = await Note.findById(noteId);
      if (!note) {
        socket.emit('error', { message: 'Note not found' });
        return;
      }

      // Only author can delete (or admin)
      if (note.author.toString() !== socket.userId && socket.user.role !== 'admin') {
        socket.emit('error', { message: 'You can only delete your own notes' });
        return;
      }

      const candidateId = note.candidateId;
      
      await Note.findByIdAndDelete(noteId);
      await Notification.deleteMany({ relatedNote: noteId });

      // Emit to all users in the candidate room
      io.to(`candidate-${candidateId}`).emit('noteDeleted', { noteId });

      console.log(`Note ${noteId} deleted by ${socket.user.name}`);
    } catch (error) {
      console.error('Delete note error:', error);
      socket.emit('error', { message: 'Failed to delete note' });
    }
  });

  // Real-time typing indicator
  socket.on('typing', (data) => {
    try {
      const { candidateId, isTyping } = data;

      if (candidateId) {
        socket.to(`candidate-${candidateId}`).emit('userTyping', {
          userId: socket.userId,
          userName: socket.user.name,
          isTyping,
          candidateId
        });
      }
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  });

  // Real-time presence (user online/offline)
  socket.on('updatePresence', (data) => {
    try {
      const { status } = data; // 'online', 'away', 'busy'
      
      socket.broadcast.emit('userPresenceUpdate', {
        userId: socket.userId,
        userName: socket.user.name,
        status,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Presence update error:', error);
    }
  });

  // Get online users in candidate room
  socket.on('getOnlineUsers', async (data) => {
    try {
      const { candidateId } = data;

      if (candidateId) {
        const room = io.sockets.adapter.rooms.get(`candidate-${candidateId}`);
        const onlineUsers = [];

        if (room) {
          for (const socketId of room) {
            const clientSocket = io.sockets.sockets.get(socketId);
            if (clientSocket && clientSocket.user) {
              onlineUsers.push({
                userId: clientSocket.userId,
                userName: clientSocket.user.name,
                email: clientSocket.user.email
              });
            }
          }
        }

        socket.emit('onlineUsers', {
          candidateId,
          users: onlineUsers
        });
      }
    } catch (error) {
      console.error('Get online users error:', error);
      socket.emit('error', { message: 'Failed to get online users' });
    }
  });

  // Mark notification as read
  socket.on('markNotificationRead', async (data) => {
    try {
      const { notificationId } = data;

      if (!notificationId) {
        socket.emit('error', { message: 'Notification ID is required' });
        return;
      }

      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: socket.userId
      });

      if (!notification) {
        socket.emit('error', { message: 'Notification not found' });
        return;
      }

      if (!notification.isRead) {
        await notification.markAsRead();
        
        const newUnreadCount = await Notification.getUnreadCount(socket.userId);
        socket.emit('unreadCountUpdate', { unreadCount: newUnreadCount });
      }

      socket.emit('notificationMarkedRead', { notificationId });
    } catch (error) {
      console.error('Mark notification read error:', error);
      socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.user?.name || socket.userId} disconnected`);
    
    // Broadcast user offline status
    socket.broadcast.emit('userPresenceUpdate', {
      userId: socket.userId,
      userName: socket.user?.name,
      status: 'offline',
      timestamp: new Date()
    });
  });

  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Ping-pong for connection health check
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });
};

module.exports = socketHandlers;