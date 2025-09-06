const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [2000, 'Note cannot exceed 2000 characters']
  },
  originalContent: {
    type: String, // Store original content before sanitization
    maxlength: [2000, 'Note cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['note', 'feedback', 'interview_note', 'decision'],
    default: 'note'
  },
  mentions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String,
      required: true
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'agree', 'disagree', 'question']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    size: Number
  }],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
noteSchema.index({ candidateId: 1, createdAt: -1 });
noteSchema.index({ author: 1 });
noteSchema.index({ 'mentions.user': 1 });

// Method to extract mentions from content
noteSchema.methods.extractMentions = function() {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(this.content)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
};

// Method to get note with populated fields
noteSchema.methods.getPopulated = function() {
  return this.populate([
    {
      path: 'author',
      select: 'name email profilePicture'
    },
    {
      path: 'mentions.user',
      select: 'name email'
    }
  ]);
};

// Pre-save middleware to handle mentions
noteSchema.pre('save', async function(next) {
  if (this.isModified('content')) {
    // Store original content
    this.originalContent = this.content;
    
    // Extract mentions
    const mentionedUsernames = this.extractMentions();
    
    if (mentionedUsernames.length > 0) {
      try {
        // Find users by username (assuming username is derived from name or email)
        const User = mongoose.model('User');
        const mentionedUsers = await User.find({
          $or: [
            { name: { $in: mentionedUsernames } },
            { email: { $in: mentionedUsernames.map(u => `${u}@`) } }
          ]
        }).select('_id name');
        
        this.mentions = mentionedUsers.map(user => ({
          user: user._id,
          username: user.name
        }));
      } catch (error) {
        console.error('Error extracting mentions:', error);
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('Note', noteSchema);