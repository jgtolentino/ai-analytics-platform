// ErrorFallback.tsx - Comprehensive error handling to prevent empty pages
// Ensures MVP never shows broken links or empty pages
// Version: 1.0.0

import React from 'react';

interface ErrorFallbackProps {
  error?: Error | string | null;
  onRetry?: () => void;
  showDetails?: boolean;
  fallbackData?: any;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

// Main Error Fallback Component
export function ErrorFallback({ 
  error, 
  onRetry, 
  showDetails = false, 
  fallbackData,
  componentName = 'Component'
}: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : (error || 'Unknown error occurred');
  const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Log error for debugging
  React.useEffect(() => {
    if (error) {
      console.error(`[${componentName}] Error:`, error);
      console.error(`Error ID: ${errorId}`);
    }
  }, [error, componentName, errorId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* Error Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <span className="text-2xl">🚨</span>
          </div>

          {/* Error Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">
              We're having trouble loading this page. Don't worry, your data is safe.
            </p>

            {showDetails && (
              <div className="bg-gray-50 rounded p-3 mb-4 text-left">
                <p className="text-xs text-gray-500 mb-1">Error Details:</p>
                <p className="text-sm text-gray-700 font-mono break-words">{errorMessage}</p>
                <p className="text-xs text-gray-400 mt-1">ID: {errorId}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔄 Try Again
                </button>
              )}
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                🏠 Go to Dashboard
              </button>
            </div>

            {/* Fallback Data Notice */}
            {fallbackData && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  📊 Showing cached data from previous session
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Need help?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="/help" className="text-blue-600 hover:text-blue-800">📚 Documentation</a>
            <a href="/support" className="text-blue-600 hover:text-blue-800">💬 Support</a>
            <a href="/status" className="text-blue-600 hover:text-blue-800">📊 System Status</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Boundary Class Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any>; },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<any>; }) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Error ID:', this.state.errorId);
    
    // You could send error to logging service here
    // Example: sendErrorToLoggingService(error, errorInfo, this.state.errorId);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null, errorId: '' })}
          showDetails={process.env.NODE_ENV === 'development'}
          componentName="ErrorBoundary"
        />
      );
    }

    return this.props.children;
  }
}

// Loading Fallback with Skeleton
export function LoadingFallback({ 
  message = 'Loading...',
  showSkeleton = true 
}: { 
  message?: string; 
  showSkeleton?: boolean; 
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showSkeleton ? (
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// No Data Fallback
export function NoDataFallback({ 
  title = 'No Data Available',
  message = 'There\'s no data to display right now.',
  actionLabel = 'Refresh Data',
  onAction,
  icon = '📊'
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {actionLabel}
          </button>
        )}
        
        <div className="mt-6">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

// Network Error Fallback
export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌐</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Problem</h3>
        <p className="text-gray-600 mb-6">
          We're having trouble connecting to our servers. Please check your internet connection and try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            🔄 Refresh Page
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Status: <span className="font-mono">Connection Failed</span></p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}

// Component wrapper with error handling
export function SafeComponent({ 
  children, 
  fallback,
  onError 
}: { 
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  onError?: (error: Error) => void;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorFallback;