import { ButtonHTMLAttributes, ReactNode } from 'react';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary';
}

export function RetroButton({
  children,
  variant = 'default',
  className = '',
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={`mac-button transition-transform active:translate-y-0.5 ${
        variant === 'primary' ? 'bg-black text-white' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
