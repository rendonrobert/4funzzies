import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'text-[8vw] tracking-[5px]',  // Doubled size from 4vw, reduced tracking
    large: 'text-[17vw] tracking-[15px]'  // Doubled size from 8.5vw
  };

  return (
    <h1 
      data-text="Vibe"
      className={`logo-glitch logo-text relative inline-block 
                 ${sizeClasses[size]} font-light m-0 leading-[0.9]
                 ${className}`}
    >
      Vibe
    </h1>
  );
};