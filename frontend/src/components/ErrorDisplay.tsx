import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-vibe-glass p-6 rounded-lg shadow-xl max-w-md mx-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg leading-6 font-medium text-white">Error</h3>
            <div className="mt-2">
              <p className="text-sm text-vibe-text-secondary">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full inline-flex justify-center rounded-md px-4 py-2 bg-vibe-accent text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibe-accent"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
