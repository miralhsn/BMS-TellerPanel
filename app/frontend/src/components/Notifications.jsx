import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const Notifications = ({ customerId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, [customerId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await customerService.getNotifications(customerId);
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to load notifications');
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
    if (status === 'success') return '✅';
    if (status === 'rejected') return '❌';
    return '⏳';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading notifications...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No notifications</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">
                    {getNotificationIcon(notification.type, notification.status)}
                  </span>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    {notification.details.amount && (
                      <p className="text-sm text-gray-600">
                        Amount: ${notification.details.amount.toFixed(2)}
                      </p>
                    )}
                    {notification.details.reason && (
                      <p className="text-sm text-red-600">
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
                    className="text-xs text-blue-600 hover:text-blue-800"
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
  );
};

export default Notifications; 