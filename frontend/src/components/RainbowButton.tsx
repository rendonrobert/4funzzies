import React from 'react';

interface RainbowButtonProps {
  onClick: () => void;
  isListening: boolean;
  isProcessing: boolean;
  progress: number;
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  onClick,
  isListening,
  isProcessing,
  progress
}) => {
  return (
    <div className="relative">
      {/* Pulsing background effect */}
      <div 
        className={`absolute inset-0 rounded-full bg-rainbow-gradient bg-gradient-size animate-gradient-flow 
          ${isListening ? 'animate-pulse-slow opacity-80' : 'opacity-60'}`}
        style={{ filter: 'blur(8px)' }}
      ></div>
      
      {/* Button */}
      <button
        onClick={onClick}
        disabled={isListening || isProcessing}
        className={`
          relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full 
          flex items-center justify-center
          bg-rainbow-gradient bg-gradient-size animate-gradient-flow 
          shadow-lg transform transition-all duration-300
          ${isListening ? 'scale-110' : isProcessing ? 'scale-95 opacity-70' : 'scale-100 hover:scale-105'}
        `}
      >
        <span className="sr-only">Identify Song</span>
        
        {/* Icon/Content */}
        <div className="flex flex-col items-center justify-center">
          {isListening ? (
            <>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1.5 bg-white rounded-full animate-pulse"
                    style={{
                      height: `${Math.max(10, Math.min(30, 15 + Math.sin(Date.now() / (500 + i * 100)) * 12))}px`,
                      animationDelay: `${i * 0.15}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="mt-1 text-xs font-semibold text-white">Listening...</div>
            </>
          ) : isProcessing ? (
            <div className="text-white font-semibold text-sm">
              Processing...
            </div>
          ) : (
            <div className="text-white font-semibold">
              ID Song
            </div>
          )}
        </div>
      </button>
      
      {/* Progress indicator */}
      {isListening && (
        <div className="absolute -bottom-8 left-0 w-full">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
