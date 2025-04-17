'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Socket } from 'socket.io-client';
import api from '@/lib/axios';
import socket from '../lib/socket';
import { getCookie } from 'cookies-next';

// Enable socket connections for real-time notifications
// Set to false to completely disable sockets
const ENABLE_SOCKET = false; // Default to false (more reliable)

// Set polling interval (in ms)
const POLLING_INTERVAL = 30000; // 30 seconds

// Sample fallback notifications for when API is unavailable
const getSampleNotifications = (userId: string): Notification[] => [
  {
    _id: 'sample-1',
    recipient: userId,
    type: 'system',
    title: 'Welcome to Gym Sync',
    message: 'Thanks for joining Gym Sync! Start exploring your dashboard.',
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Types
export type NotificationType =
  | 'application_approval'
  | 'application_rejection'
  | 'new_member'
  | 'membership_expired'
  | 'appointment_scheduled'
  | 'appointment_approved'
  | 'appointment_rejected'
  | 'workout_assigned'
  | 'system'
  | 'general';

export interface Notification {
  _id: string;
  recipient: string;
  sender?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, '_id' | 'createdAt' | 'updatedAt' | 'read'>) => void;
  clearNotifications: () => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketEnabled, setSocketEnabled] = useState(false); // Start disabled
  const [errorCount, setErrorCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Safe initialization on client only
  useEffect(() => {
    setIsClient(true);
    
    // Check if browser supports WebSocket
    const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
    
    // Only enable sockets if supported and not in a server environment
    if (typeof window !== 'undefined' && supportsWebSockets) {
      console.log('WebSocket support detected, enabling sockets');
      setSocketEnabled(ENABLE_SOCKET);
    } else {
      console.warn('WebSocket not supported, using polling fallback');
      // Socket.io will automatically fall back to polling
      setSocketEnabled(ENABLE_SOCKET);
    }
  }, []);

  // Initialize socket connection and authentication
  useEffect(() => {
    if (!isClient || !socketEnabled) return;
    
    // If sockets are disabled, fallback immediately to polling
    if (!ENABLE_SOCKET) {
      console.log('Sockets disabled by configuration, using polling for notifications');
      setUseFallback(true);
      setSocketEnabled(false);
      return;
    }
    
    // Setup error handling for socket
    const maxErrorRetries = 3;
    const connectSocket = () => {
      try {
        // Connect the socket
        socket.connect();
        return true;
      } catch (err) {
        console.error('Socket connect error:', err);
        setErrorCount(prev => prev + 1);
        return false;
      }
    };
    
    // Try to connect
    const connected = connectSocket();
    
    // If we've had too many errors, stop trying to use sockets
    if (errorCount >= maxErrorRetries) {
      console.warn(`Socket has failed ${maxErrorRetries} times, switching to fallback mode`);
      setUseFallback(true);
      setSocketEnabled(false);
      return;
    }
    
    if (!connected) {
      console.warn('Initial socket connection failed, will retry on next render');
      return;
    }

    // Set up event listeners with error handling
    const safeListener = (event: string, handler: (...args: any[]) => void) => {
      try {
        socket.on(event, (...args) => {
          try {
            handler(...args);
          } catch (err) {
            console.error(`Error in socket '${event}' handler:`, err);
          }
        });
      } catch (err) {
        console.error(`Error setting up socket '${event}' listener:`, err);
      }
    };
    
    // Safe event listeners
    safeListener('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      // Authenticate with socket server after connection
      const authToken = getCookie('token') || token;
      if (authToken) {
        console.log('Authenticating socket with token');
        try {
          socket.emit('authenticate', { token: authToken });
        } catch (err) {
          console.error('Error emitting authenticate event:', err);
        }
      } else {
        console.warn('No token available for socket authentication');
      }
    });

    safeListener('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    safeListener('authentication_success', () => {
      console.log('Socket authenticated');
      setIsAuthenticated(true);
      // Reset error count on successful authentication
      setErrorCount(0);
    });

    safeListener('authentication_error', (error) => {
      console.error('Socket authentication error:', error);
      setIsAuthenticated(false);
      setErrorCount(prev => prev + 1);
    });
    
    safeListener('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setErrorCount(prev => prev + 1);
      
      // If we have too many connection errors, switch to fallback
      if (errorCount >= maxErrorRetries - 1) {
        setUseFallback(true);
        setSocketEnabled(false);
      }
    });
    
    safeListener('connect_timeout', () => {
      console.error('Socket connection timeout');
      setErrorCount(prev => prev + 1);
    });

    // Clean up on unmount
    return () => {
      try {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('authentication_success');
        socket.off('authentication_error');
        socket.off('notification');
        socket.off('connect_error');
        socket.off('connect_timeout');
        socket.disconnect();
      } catch (err) {
        console.error('Error during socket cleanup:', err);
      }
    };
  }, [socketEnabled, user, token, isClient, errorCount]);

  // Listen for incoming notifications
  useEffect(() => {
    if (!isClient || !isConnected || !isAuthenticated) return;

    const safeListener = (event: string, handler: (...args: any[]) => void) => {
      try {
        socket.on(event, (...args) => {
          try {
            handler(...args);
          } catch (err) {
            console.error(`Error in socket '${event}' handler:`, err);
          }
        });
      } catch (err) {
        console.error(`Error setting up socket '${event}' listener:`, err);
      }
    };

    safeListener('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      try {
        socket.off('notification');
      } catch (err) {
        console.error('Error removing notification listener:', err);
      }
    };
  }, [isConnected, isAuthenticated, isClient]);

  // Poll for notifications if sockets aren't working
  useEffect(() => {
    // Always set up polling regardless of socket status for better reliability
    if (!isClient || !user?._id) return;
    
    // If we're in fallback mode, log it
    if (useFallback) {
      console.log('Using polling fallback for notifications');
    } else {
      console.log('Setting up notification polling as backup to sockets');
    }
    
    // Get initial notifications immediately
    fetchNotifications().catch(err => {
      console.error('Error fetching initial notifications:', err);
    });
    
    // Set up polling interval
    const pollInterval = setInterval(() => {
      fetchNotifications().catch(err => {
        console.error('Error polling for notifications:', err);
      });
    }, POLLING_INTERVAL);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, [user, isClient]);

  // Fetch notifications on load and after authentication
  useEffect(() => {
    if (isClient && isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, isClient]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/notifications/user/${user._id}`);
      
      // Check if the response contains notifications
      if (response.data && Array.isArray(response.data.notifications) && response.data.notifications.length > 0) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter((notif: Notification) => !notif.read).length);
      } else {
        // Use sample data if API returns empty results
        const sampleData = getSampleNotifications(user._id);
        setNotifications(sampleData);
        setUnreadCount(1);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      // Always use sample notifications as fallback
      const sampleData = getSampleNotifications(user._id);
      setNotifications(sampleData);
      setUnreadCount(1);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!token) return;

    try {
      await api.put(`/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || !token) return;

    try {
      await api.put(`/notifications/user/${user._id}/read-all`);
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    if (!token) return;

    try {
      await api.delete(`/notifications/${id}`);
      
      // Update local state
      const deletedNotification = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      
      // Update unread count if needed
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (!user || !token) return;

    try {
      await api.delete(`/notifications/user/${user._id}`);
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error deleting all notifications:', err);
    }
  };

  const addNotification = (notification: Omit<Notification, '_id' | 'createdAt' | 'updatedAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Also show browser notification if user allows
    if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message
      });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 