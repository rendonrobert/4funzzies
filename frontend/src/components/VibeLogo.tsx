import React from 'react';
// We'll use placeholder images for now
import audiowaveGif from '../assets/audio-wave.gif';

interface VibeLogoProps {
  animated?: boolean;
}

const VibeLogo: React.FC<VibeLogoProps> = ({ animated = true }) => {
  return (
    <div className="vibe-logo-container">
      {/* SVG Outline of the Vibe logo */}
      <svg 
        className="vibe-logo" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M100 190C149.706 190 190 149.706 190 100C190 50.2944 149.706 10 100 10C50.2944 10 10 50.2944 10 100C10 149.706 50.2944 190 100 190Z" 
          stroke="white" 
          strokeWidth="3"
          fill="none"
        />
        {/* Add stylized V shape inside the circle */}
        <path 
          d="M70 50L100 130L130 50" 
          stroke="white" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        {/* Add sound waves */}
        <path 
          d="M50 100C50 100 60 90 70 100C80 110 90 90 100 100C110 110 120 90 130 100C140 110 150 90 160 100" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <text 
          x="100" 
          y="170" 
          fill="white" 
          fontSize="24" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontWeight="bold"
        >
          VIBE
        </text>
      </svg>
      
      {/* Animated fill (GIF or gradient animation) */}
      {animated && (
        <div 
          className="vibe-logo-fill"
          style={{
            backgroundImage: `url(${audiowaveGif})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
      )}
    </div>
  );
};

export default VibeLogo;
