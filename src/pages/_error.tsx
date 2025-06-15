// _error.tsx - Custom error page to handle all errors gracefully
// Ensures no empty pages or broken states in production
// Version: 1.0.0

import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function ErrorPage({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  // Determine error type and appropriate response
  const getErrorInfo = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Page Not Found',
          message: 'The page you\'re looking for doesn\'t exist or has been moved.',
          icon: '🔍',
          suggestions: [
            { text: 'Go to Dashboard', href: '/' },
            { text: 'View Analytics', href: '/analytics' },
            { text: 'Browse Data', href: '/data' }
          ]
        };
      case 500:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. We\'re working to fix it.',
          icon: '🔧',
          suggestions: [
            { text: 'Try Again', href: window?.location?.href || '/' },
            { text: 'Go to Dashboard', href: '/' },
            { text: 'Contact Support', href: '/support' }
          ]
        };
      case 503:
        return {
          title: 'Service Unavailable',
          message: 'Our service is temporarily unavailable. Please try again in a few minutes.',
          icon: '⏰',
          suggestions: [
            { text: 'Refresh Page', href: window?.location?.href || '/' },
            { text: 'Check Status', href: '/status' },
            { text: 'Go to Dashboard', href: '/' }
          ]
        };
      default:
        return {
          title: 'Something Went Wrong',
          message: statusCode 
            ? `An error (${statusCode}) occurred on the server.`
            : 'An error occurred on the client.',
          icon: '⚠️',
          suggestions: [
            { text: 'Go to Dashboard', href: '/' },
            { text: 'Refresh Page', href: window?.location?.href || '/' },
            { text: 'Get Help', href: '/help' }
          ]
        };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="text-6xl mb-6">{errorInfo.icon}</div>
        
        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {errorInfo.title}
        </h1>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          {errorInfo.message}
        </p>
        
        {/* Status Code */}
        {statusCode && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Error Code</p>
            <p className="text-xl font-mono font-bold text-gray-800">{statusCode}</p>
          </div>
        )}
        
        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">Here's what you can do:</p>
          
          {errorInfo.suggestions.map((suggestion, index) => (
            <a
              key={index}
              href={suggestion.href}
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={(e) => {
                // Handle special actions
                if (suggestion.text === 'Try Again' || suggestion.text === 'Refresh Page') {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              {suggestion.text}
            </a>
          ))}
        </div>
        
        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && err && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Developer Details
            </summary>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-xs">
              <p className="font-bold text-red-800 mb-2">Error Stack:</p>
              <pre className="text-red-700 whitespace-pre-wrap overflow-auto">
                {err.stack || err.message || 'No error details available'}
              </pre>
            </div>
          </details>
        )}
        
        {/* Help Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Need help?</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="/help" className="text-blue-600 hover:text-blue-800">
              📚 Documentation
            </a>
            <a href="/support" className="text-blue-600 hover:text-blue-800">
              💬 Support
            </a>
            <a href="/status" className="text-blue-600 hover:text-blue-800">
              📊 System Status
            </a>
          </div>
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-6">
          Error occurred at {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  
  // Log error for monitoring
  if (err) {
    console.error('Error page rendered:', {
      statusCode,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
  
  return { statusCode };
};

export default ErrorPage;