import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-display font-medium tracking-wide whitespace-nowrap shrink-0 rounded-lg transition-all duration-200 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(56,189,248,0.45)] hover:brightness-110 border border-white/15',
    secondary:
      'bg-[#0b0f1a]/90 text-slate-100 border border-slate-700/80 hover:border-sky-400/60 hover:bg-[#111827] hover:text-white shadow-sm',
    ghost:
      'bg-transparent text-slate-300 border border-transparent hover:text-white hover:bg-white/5',
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'min-h-[40px] px-4 py-2 text-xs',
    md: 'min-h-[42px] px-5 py-2.5 text-sm',
    lg: 'min-h-[48px] px-7 py-3 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
