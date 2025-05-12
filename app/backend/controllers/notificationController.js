const Notification = require('../models/Notification');
const createError = require('http-errors');

const notificationController = {
  // Get customer notifications
  getNotifications: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const notifications = await Notification.find({ customerId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark notification as read
  markAsRead: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      if (!notification) {
        throw createError(404, 'Notification not found');
      }

      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  },

  // Get unread count
  getUnreadCount: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const count = await Notification.countDocuments({
        customerId,
        read: false
      });

      res.json({
        status: 'success',
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all notifications
  getAllNotifications: async (req, res, next) => {
    try {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController; 