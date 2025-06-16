// Error Boundary for Fallback Mode
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In fallback mode, we silently log errors but don't break the UI
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span className="text-sm">Content unavailable</span>
          </div>
          {this.props.showError && this.state.error && (
            <details className="mt-2 text-xs text-gray-500">
              <summary className="cursor-pointer">Details</summary>
              <pre className="mt-1 whitespace-pre-wrap">{this.state.error.message}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe wrapper for components that might fail
export function SafeComponent({ 
  children, 
  fallback, 
  name 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  name?: string;
}) {
  return (
    <ErrorBoundary 
      fallback={fallback || (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-500">
            {name ? `${name} unavailable` : 'Content unavailable'}
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}