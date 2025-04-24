
import React from 'react';

type PenguinMascotProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'float' | 'bounce' | 'wave' | 'none';
  className?: string;
};

const PenguinMascot: React.FC<PenguinMascotProps> = ({
  size = 'md',
  animation = 'float',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const animationClasses = {
    float: 'animate-float',
    bounce: 'animate-bounce',
    wave: 'animate-pulse-slow',
    none: '',
  };

  return (
    <div className={`${sizeClasses[size]} ${animationClasses[animation]} ${className}`}>
      <img 
        src="/lovable-uploads/c9c12ecd-5484-41d9-9f95-9c793f124ae2.png" 
        alt="HeadDoWell Penguin Mascot" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default PenguinMascot;
