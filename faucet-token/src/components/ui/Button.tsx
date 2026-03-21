import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'emerald' | 'amber' | 'violet' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variants = {
  emerald: [
    'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600',
    'text-surface-0 font-semibold',
    'shadow-[0_0_20px_rgba(52,211,153,0.2)]',
    'hover:shadow-[0_0_28px_rgba(52,211,153,0.35)]',
    'disabled:bg-emerald-500/30 disabled:shadow-none',
  ].join(' '),
  amber: [
    'bg-amber-500 hover:bg-amber-400 active:bg-amber-600',
    'text-surface-0 font-semibold',
    'shadow-[0_0_20px_rgba(251,191,36,0.2)]',
    'hover:shadow-[0_0_28px_rgba(251,191,36,0.35)]',
    'disabled:bg-amber-500/30 disabled:shadow-none',
  ].join(' '),
  violet: [
    'bg-violet-500 hover:bg-violet-400 active:bg-violet-600',
    'text-white font-semibold',
    'shadow-[0_0_20px_rgba(167,139,250,0.2)]',
    'hover:shadow-[0_0_28px_rgba(167,139,250,0.35)]',
    'disabled:bg-violet-500/30 disabled:shadow-none',
  ].join(' '),
  ghost: [
    'bg-white/5 hover:bg-white/8 active:bg-white/10',
    'text-text-secondary hover:text-text-primary',
    'border border-white/10 hover:border-white/20',
    'disabled:opacity-40',
  ].join(' '),
  outline: [
    'bg-transparent hover:bg-white/4',
    'text-text-secondary hover:text-text-primary',
    'border border-white/12 hover:border-white/20',
    'disabled:opacity-30',
  ].join(' '),
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-sm rounded-xl',
};

export function Button({
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-body transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
        'disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
