import React, { useState, useEffect, useRef } from 'react';

interface RainbowButtonProps {
  onClick: () => void;
  isListening: boolean;
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({ onClick, isListening }) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    if (isListening) {
      progressRef.current = 0;
      const startTime = Date.now();
      const duration = 12000; // 12 seconds

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        progressRef.current = Math.min((elapsed / duration) * 100, 100);
        setProgress(progressRef.current);

        if (progressRef.current < 100) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    } else {
      setProgress(0);
    }
  }, [isListening]);

  return (
    <div className="relative inline-block">
      <div
        className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] 
                   bg-[length:400%_400%] animate-rainbow rounded-lg"
        style={{
          backgroundImage: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
          filter: isListening ? 'blur(8px)' : 'blur(5px)',
          transform: isListening ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
        }}
      />
      
      <button 
        className="relative px-8 py-2 bg-neutral-900 text-white rounded-lg cursor-pointer select-none overflow-hidden"
        onClick={onClick}
        disabled={isListening}
      >
        {isListening ? (
          <span
            className="transition-all duration-100 relative"
            style={{
              backgroundImage: `linear-gradient(to right, cyan ${progress}%, white ${progress}%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Vibing...
          </span>
        ) : (
          "ID Song 🎧"
        )}
      </button>
    </div>
  );
};
