import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-gray-500',
  white: 'text-white'
};

export default function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
} 