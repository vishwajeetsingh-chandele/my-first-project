const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Candidate email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'],
    default: 'new'
  },
  source: {
    type: String,
    trim: true,
    maxlength: [50, 'Source cannot exceed 50 characters']
  },
  resume: {
    type: String, // URL to resume file
    default: null
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number, // Years of experience
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  salary: {
    expected: {
      type: Number,
      min: [0, 'Expected salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      maxlength: [3, 'Currency code should be 3 characters']
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
candidateSchema.index({ name: 1 });
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ createdBy: 1 });
candidateSchema.index({ createdAt: -1 });

// Compound index for filtering
candidateSchema.index({ createdBy: 1, status: 1 });

// Virtual for full candidate profile
candidateSchema.virtual('fullProfile').get(function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    position: this.position,
    status: this.status,
    source: this.source,
    skills: this.skills,
    experience: this.experience,
    salary: this.salary,
    tags: this.tags,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Method to get candidate summary
candidateSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    position: this.position,
    status: this.status,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Candidate', candidateSchema);