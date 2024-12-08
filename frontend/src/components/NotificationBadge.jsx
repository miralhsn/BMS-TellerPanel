import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const NotificationBadge = ({ customerId }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await customerService.getUnreadNotificationCount(customerId);
        setUnreadCount(response.data.count);
      } catch (err) {
        console.error('Failed to load unread count:', err);
      }
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [customerId]);

  return unreadCount > 0 ? (
    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
      {unreadCount}
    </span>
  ) : null;
};

export default NotificationBadge; 