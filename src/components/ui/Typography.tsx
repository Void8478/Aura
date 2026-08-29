import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

// Display Heading (Editorial Hero Title)
export const Display: React.FC<TypographyProps> = ({ as: Component = 'h1', className, children, ...props }) => (
  <Component
    className={twMerge(
      clsx(
        'font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-aura-100 leading-[1.06] tracking-tight',
        className
      )
    )}
    {...props}
  >
    {children}
  </Component>
);

// Page Title
export const PageTitle: React.FC<TypographyProps> = ({ as: Component = 'h1', className, children, ...props }) => (
  <Component
    className={twMerge(
      clsx(
        'font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-aura-100 leading-tight tracking-tight',
        className
      )
    )}
    {...props}
  >
    {children}
  </Component>
);

// Section Title
export const SectionTitle: React.FC<TypographyProps> = ({ as: Component = 'h2', className, children, ...props }) => (
  <Component
    className={twMerge(
      clsx(
        'font-serif text-2xl sm:text-3xl font-medium text-aura-100 leading-snug',
        className
      )
    )}
    {...props}
  >
    {children}
  </Component>
);

// Body Text
export const BodyText: React.FC<TypographyProps & { size?: 'sm' | 'base' | 'lg'; muted?: boolean }> = ({
  as: Component = 'p',
  size = 'base',
  muted = false,
  className,
  children,
  ...props
}) => {
  const sizes = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
  };

  return (
    <Component
      className={twMerge(
        clsx(
          'font-sans',
          sizes[size],
          muted ? 'text-aura-400' : 'text-aura-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Metadata Text (BPM, Keys, Dates, Telemetry)
export const MetadataText: React.FC<TypographyProps & { highlight?: boolean }> = ({
  as: Component = 'span',
  highlight = false,
  className,
  children,
  ...props
}) => (
  <Component
    className={twMerge(
      clsx(
        'font-mono text-xs tracking-normal',
        highlight ? 'text-aura-accent' : 'text-aura-400',
        className
      )
    )}
    {...props}
  >
    {children}
  </Component>
);

// Label Text (Uppercase Eyebrows, Badges)
export const LabelText: React.FC<TypographyProps & { variant?: 'accent' | 'amber' | 'muted' }> = ({
  as: Component = 'span',
  variant = 'muted',
  className,
  children,
  ...props
}) => {
  const variants = {
    accent: 'text-aura-accent',
    amber: 'text-aura-amber',
    muted: 'text-aura-400',
  };

  return (
    <Component
      className={twMerge(
        clsx(
          'font-mono text-[11px] uppercase tracking-wider font-medium',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
