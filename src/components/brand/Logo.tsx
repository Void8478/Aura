import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  linkToHome = true,
}) => {
  // Dimensions map based on size
  const sizes = {
    sm: {
      icon: 24,
      width: 'w-24',
      height: 'h-6',
    },
    md: {
      icon: 32,
      width: 'w-32',
      height: 'h-8',
    },
    lg: {
      icon: 48,
      width: 'w-48',
      height: 'h-12',
    },
    xl: {
      icon: 64,
      width: 'w-64',
      height: 'h-16',
    },
  };

  const currentSize = sizes[size];

  // SVG gradient IDs to avoid collision
  const gradIconId = `aura-logo-grad-${size}-${variant}`;
  const gradSoundId = `aura-sound-grad-${size}-${variant}`;

  // Stylized modern "A" ribbon icon SVG
  const renderIcon = () => (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        {/* Ribbon linear gradient: Indigo -> Purple -> Rose */}
        <linearGradient id={gradIconId} x1="15" y1="80" x2="85" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        {/* Sound-wave bars linear gradient: Purple -> Rose */}
        <linearGradient id={gradSoundId} x1="29" y1="52" x2="71" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Styled letter 'A' Outer Ribbon Frame */}
      <path
        d="M 22 75 C 18 78, 13 74, 15 69 L 44 19 C 47 13, 53 13, 56 19 L 85 69 C 87 74, 82 78, 78 75 C 70 68, 62 60, 56 50 C 52 44, 48 44, 44 50 C 38 60, 30 68, 22 75 Z"
        fill={`url(#${gradIconId})`}
      />

      {/* Sound-wave bars inside the A-frame inner opening */}
      {/* Center Bar */}
      <line
        x1="50"
        y1="43"
        x2="50"
        y2="61"
        stroke={`url(#${gradSoundId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Left 1 Bar */}
      <line
        x1="43"
        y1="47"
        x2="43"
        y2="57"
        stroke={`url(#${gradSoundId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right 1 Bar */}
      <line
        x1="57"
        y1="47"
        x2="57"
        y2="57"
        stroke={`url(#${gradSoundId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Left 2 Bar */}
      <line
        x1="36"
        y1="50"
        x2="36"
        y2="54"
        stroke={`url(#${gradSoundId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right 2 Bar */}
      <line
        x1="64"
        y1="50"
        x2="64"
        y2="54"
        stroke={`url(#${gradSoundId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Left Dot */}
      <circle cx="29" cy="52" r="1.5" fill="#8b5cf6" />
      {/* Right Dot */}
      <circle cx="71" cy="52" r="1.5" fill="#ec4899" />
    </svg>
  );

  // Geometric custom text logo: A U R A
  const renderWordmark = (heightClass: string) => (
    <svg
      viewBox="0 0 160 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightClass} text-current`}
      aria-hidden="true"
    >
      {/* A (Λ) */}
      <path
        d="M 6 36 L 22 6 L 38 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* U */}
      <path
        d="M 48 6 L 48 26 C 48 33, 72 33, 72 26 L 72 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* R */}
      <path
        d="M 82 36 L 82 6 L 102 6 C 111 6, 111 20, 102 20 L 82 20 M 96 20 L 112 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* A (Λ) */}
      <path
        d="M 122 36 L 138 6 L 154 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderContent = () => {
    if (variant === 'icon') {
      return renderIcon();
    }

    if (variant === 'horizontal') {
      return (
        <div className="flex items-center gap-2.5">
          {renderIcon()}
          {renderWordmark('h-4 sm:h-5')}
        </div>
      );
    }

    // Default: 'full' (Vertical stack logo)
    return (
      <div className="flex flex-col items-center gap-2">
        {renderIcon()}
        {renderWordmark('h-6')}
      </div>
    );
  };

  if (linkToHome) {
    return (
      <Link
        to="/"
        className={`inline-flex items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-aura-accent rounded-lg transition-opacity hover:opacity-90 ${className}`}
        aria-label="AURA home"
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {renderContent()}
    </div>
  );
};

export default Logo;
