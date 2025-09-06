const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token is required' 
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token - user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account is deactivated' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token has expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Token verification failed' 
    });
  }
};

// Middleware to check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole('admin');

// Middleware to check if user is recruiter or admin
const requireRecruiterOrAdmin = requireRole('recruiter', 'admin');

// Middleware to check if user can access candidate
const canAccessCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId || req.params.id;
    
    if (!candidateId) {
      return res.status(400).json({ 
        error: 'Candidate ID is required' 
      });
    }

    const Candidate = require('../models/Candidate');
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ 
        error: 'Candidate not found' 
      });
    }

    // Admin can access all candidates
    if (req.user.role === 'admin') {
      req.candidate = candidate;
      return next();
    }

    // Check if user is the creator or assigned to the candidate
    const isCreator = candidate.createdBy.toString() === req.user._id.toString();
    const isAssigned = candidate.assignedTo.some(
      assignee => assignee.toString() === req.user._id.toString()
    );

    if (!isCreator && !isAssigned) {
      return res.status(403).json({ 
        error: 'You do not have access to this candidate' 
      });
    }

    req.candidate = candidate;
    next();
  } catch (error) {
    console.error('Candidate access check error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify candidate access' 
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireRecruiterOrAdmin,
  canAccessCandidate,
  generateToken
};