import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  name,
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold overflow-hidden',
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'User Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        name && getInitials(name)
      )}
    </div>
  );
};
