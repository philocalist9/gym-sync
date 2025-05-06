'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/button';

/**
 * NetworkErrorHandler component
 * 
 * Provides specialized handling for network errors in specific sections of the app.
 * Particularly useful in data-fetching components that may experience connection issues.
 */
export default function NetworkErrorHandler({ 
  children,
  fallbackUI,
  showDefaultUI = false,
  autoDetect = false
}: { 
  children: React.ReactNode;
  fallbackUI?: React.ReactNode;
  showDefaultUI?: boolean; // Whether to show the default UI
  autoDetect?: boolean;    // Whether to auto-detect network issues
}) {
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Monitor online/offline status
  useEffect(() => {
    if (!autoDetect) return;

    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoDetect]);

  // Global error handler for network errors
  useEffect(() => {
    // Store original console.error to restore later
    const originalConsoleError = console.error;
    
    // Override console.error to catch and improve empty error objects
    const errorHandler = function(...args: any[]) {
      // Check if this is an API error with empty object structure
      if (
        args.length > 0 && 
        args[0] === 'API request failed:' && 
        (args[1] === undefined || 
         args[1] === null || 
         (typeof args[1] === 'object' && Object.keys(args[1]).length === 0))
      ) {
        // Improve the error reporting
        originalConsoleError(
          'API request failed (Empty Error Object) - NetworkErrorHandler active: Network connection issue detected.',
          { timestamp: new Date().toISOString() }
        );

        // If auto-detect is enabled, set the network error state
        if (autoDetect) {
          setHasNetworkError(true);
        }
        
        return;
      }
      
      // For all other cases, use the original console.error
      originalConsoleError.apply(console, args);
    };
    
    // Apply our custom error handler
    console.error = errorHandler;
    
    // Also listen for unhandled promise rejections
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      if (event.reason === undefined || 
          event.reason === null || 
          (typeof event.reason === 'object' && Object.keys(event.reason).length === 0)) {
        console.warn('NetworkErrorHandler: Caught unhandled empty promise rejection');
        
        // If auto-detect is enabled, set the network error state
        if (autoDetect) {
          setHasNetworkError(true);
        }
        
        event.preventDefault();
      }
    };
    
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);
    
    // Cleanup
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, [autoDetect]);
  
  // Default fallback UI if none provided
  const defaultFallbackUI = (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md my-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Connection Issue</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            {!isOnline ? (
              <>
                <WifiOff className="h-3.5 w-3.5 inline mr-1" />
                You are currently offline. Some features may not work properly.
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 inline mr-1" />
                There was a problem connecting to the server. Some data may not be up to date.
              </>
            )}
          </p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-800 flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {children}
      {/* Only show UI if there's an error or if showDefaultUI is true */}
      {((autoDetect && hasNetworkError) || showDefaultUI) && (fallbackUI || defaultFallbackUI)}
    </>
  );
} 