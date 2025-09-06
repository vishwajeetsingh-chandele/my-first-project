const express = require('express');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = { recipient: req.user._id };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name email profilePicture')
      .populate('relatedCandidate', 'name email')
      .populate('relatedNote', 'content type')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      notifications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalNotifications: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to fetch notifications'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to get unread count'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    if (!notification.isRead) {
      await notification.markAsRead();
      
      // Emit real-time update for unread count
      if (req.io) {
        const newUnreadCount = await Notification.getUnreadCount(req.user._id);
        req.io.to(`user-${req.user._id}`).emit('unreadCountUpdate', {
          unreadCount: newUnreadCount
        });
      }
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read for user
// @access  Private
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user._id);
    
    // Emit real-time update for unread count
    if (req.io) {
      req.io.to(`user-${req.user._id}`).emit('unreadCountUpdate', {
        unreadCount: 0
      });
    }

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      error: 'Failed to mark all notifications as read'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    // Update unread count if notification was unread
    if (!notification.isRead && req.io) {
      const newUnreadCount = await Notification.getUnreadCount(req.user._id);
      req.io.to(`user-${req.user._id}`).emit('unreadCountUpdate', {
        unreadCount: newUnreadCount
      });
    }

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      error: 'Failed to delete notification'
    });
  }
});

// @route   DELETE /api/notifications
// @desc    Delete all read notifications for user
// @access  Private
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id,
      isRead: true
    });

    res.json({
      message: `${result.deletedCount} read notifications deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({
      error: 'Failed to delete read notifications'
    });
  }
});

// @route   GET /api/notifications/by-candidate/:candidateId
// @desc    Get notifications for specific candidate
// @access  Private
router.get('/by-candidate/:candidateId', authenticateToken, validateObjectId('candidateId'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notifications = await Notification.find({
      recipient: req.user._id,
      relatedCandidate: req.params.candidateId
    })
      .populate('sender', 'name email profilePicture')
      .populate('relatedNote', 'content type')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Notification.countDocuments({
      recipient: req.user._id,
      relatedCandidate: req.params.candidateId
    });

    res.json({
      notifications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalNotifications: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get candidate notifications error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate notifications'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics for user
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalNotifications,
      unreadCount,
      notificationsByType,
      recentActivity
    ] = await Promise.all([
      // Total notifications
      Notification.countDocuments({ recipient: req.user._id }),
      
      // Unread count
      Notification.getUnreadCount(req.user._id),
      
      // Notifications by type
      Notification.aggregate([
        { $match: { recipient: req.user._id } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      
      // Recent activity (last 7 days)
      Notification.countDocuments({
        recipient: req.user._id,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const typeStats = notificationsByType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalNotifications,
      unreadCount,
      notificationsByType: typeStats,
      recentActivity
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch notification statistics'
    });
  }
});

module.exports = router;