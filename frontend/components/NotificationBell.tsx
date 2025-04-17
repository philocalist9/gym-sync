'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle notification click
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_approval':
        return '✅';
      case 'application_rejection':
        return '❌';
      case 'new_member':
        return '👤';
      case 'membership_expired':
        return '⏱️';
      case 'appointment_scheduled':
        return '📅';
      case 'appointment_approved':
        return '👍';
      case 'appointment_rejected':
        return '👎';
      case 'workout_assigned':
        return '💪';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-2 px-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => markAllAsRead()}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div 
                        className={cn(
                          "flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                          !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                        onClick={() => handleNotificationClick(notification._id)}
                      >
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <span>{getNotificationIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell; 