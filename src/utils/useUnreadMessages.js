import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from './constants';

export const useUnreadMessages = (targetUserId, complaintId) => {
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const checkUnreadMessages = useCallback(async () => {
    if (!targetUserId) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (complaintId) {
        params.append('complaintId', complaintId);
      }
      const response = await axios.get(BASE_URL + `/chat/${targetUserId}/unread` + (params.toString() ? '?' + params.toString() : ''), {
        withCredentials: true,
      });
      setHasUnread(response.data.hasUnread);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error checking unread messages:', error);
      setHasUnread(false);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, complaintId]);

  const markAsRead = useCallback(async () => {
    if (!targetUserId) return;
    
    try {
      await axios.post(BASE_URL + `/chat/${targetUserId}/read`, {
        ...(complaintId && { complaintId }),
      }, {
        withCredentials: true,
      });
      setHasUnread(false);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [targetUserId, complaintId]);

  useEffect(() => {
    checkUnreadMessages();
    
    // Check for unread messages every 30 seconds
    const interval = setInterval(checkUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [checkUnreadMessages]);

  return {
    hasUnread,
    unreadCount,
    isLoading,
    checkUnreadMessages,
    markAsRead
  };
};
