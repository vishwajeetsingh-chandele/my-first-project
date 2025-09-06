const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mention', 'note_reply', 'candidate_assigned', 'status_change'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  relatedNote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  },
  relatedCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String, // URL to navigate to when notification is clicked
    maxlength: [500, 'Action URL cannot exceed 500 characters']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional data specific to notification type
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ relatedCandidate: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  await this.save();
};

// Static method to create mention notification
notificationSchema.statics.createMentionNotification = async function(data) {
  const { recipient, sender, note, candidate } = data;
  
  const notification = new this({
    recipient,
    sender,
    type: 'mention',
    title: `You were mentioned by ${sender.name}`,
    message: `${sender.name} mentioned you in a note about ${candidate.name}`,
    relatedNote: note._id,
    relatedCandidate: candidate._id,
    actionUrl: `/candidates/${candidate._id}/notes/${note._id}`,
    metadata: {
      noteContent: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')
    }
  });
  
  await notification.save();
  return notification;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to mark all notifications as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
  await this.updateMany(
    { recipient: userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

// Virtual for formatted creation date
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

module.exports = mongoose.model('Notification', notificationSchema);