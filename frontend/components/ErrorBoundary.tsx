'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Catch errors in any components below and log them
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // You can also log the error to an error reporting service
    // reportErrorToService(error, errorInfo);
  }

  private handleReset = (): void => {
    // Clear saved data if needed
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Reload the page to ensure a fresh state
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, use the default error UI
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-red-200 dark:border-red-900">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4 mx-auto">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">Something went wrong</h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              There was an error loading this content. You can try refreshing the page.
            </p>
            
            {/* Only show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-auto max-h-[200px] text-xs font-mono">
                <p className="font-bold mb-1">{this.state.error.toString()}</p>
                <p className="whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack || 'No stack trace available'}
                </p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 