import { useState, useEffect, useRef } from 'react';
import { customerService } from '../services/api';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await customerService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getNotificationIcon = (type, status) => {
    if (status === 'success' || status === 'cleared') return '✅';
    if (status === 'rejected') return '❌';
    return '⏳';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:w-96 mt-2 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] sm:max-h-[600px]">
          {/* Header */}
          <div className="p-4 border-b sticky top-0 bg-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type, notification.status)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm break-words">{notification.message}</p>
                          {notification.details?.amount && (
                            <p className="text-sm text-gray-600 mt-1">
                              Amount: ${notification.details.amount.toFixed(2)}
                            </p>
                          )}
                          {notification.details?.reason && (
                            <p className="text-sm text-red-600 mt-1">
                              Reason: {notification.details.reason}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 