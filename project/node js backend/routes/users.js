const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for autocomplete, mentions, etc.)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, limit = 10, role } = req.query;
    
    let query = { isActive: true };
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('_id name email role profilePicture createdAt')
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Only return full profile for admin or self
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
      res.json(user);
    } else {
      // Return limited public profile for other users
      res.json(user.getPublicProfile());
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user'
    });
  }
});

// @route   GET /api/users/search/mentions
// @desc    Search users for mentions (autocomplete)
// @access  Private
router.get('/search/mentions', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      isActive: true,
      _id: { $ne: req.user._id }, // Exclude current user
      $or: [
        { name: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } }
      ]
    })
      .select('_id name email profilePicture')
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.name.toLowerCase().replace(/\s+/g, ''), // Simple username generation
        profilePicture: user.profilePicture
      }))
    });
  } catch (error) {
    console.error('Search mentions error:', error);
    res.status(500).json({
      error: 'Failed to search users'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === req.params.id && isActive === false) {
      return res.status(400).json({
        error: 'You cannot deactivate your own account'
      });
    }

    // Update fields
    if (name) {
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          error: 'Name must be between 2 and 50 characters'
        });
      }
      user.name = name;
    }

    if (email) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already exists for another user'
        });
      }
      
      user.email = email;
    }

    if (role && ['recruiter', 'hiring_manager', 'admin'].includes(role)) {
      user.role = role;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Deactivate user (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        error: 'You cannot deactivate your own account'
      });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.json({
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      error: 'Failed to deactivate user'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get users overview stats (Admin only)
// @access  Private (Admin)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.countDocuments({
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const roleStats = usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: roleStats,
      recentUsers // Users created in last 30 days
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics'
    });
  }
});

// @route   POST /api/users/:id/activate
// @desc    Reactivate user (Admin only)
// @access  Private (Admin)
router.post('/:id/activate', authenticateToken, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        error: 'User is already active'
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      message: 'User reactivated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({
      error: 'Failed to reactivate user'
    });
  }
});

module.exports = router;