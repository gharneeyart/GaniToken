import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, suffix, prefix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-mono uppercase tracking-widest text-text-secondary">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2',
            'bg-surface-2 border rounded-xl px-3.5',
            'transition-all duration-200',
            error
              ? 'border-red-500/40 focus-within:border-red-500/70'
              : 'border-white/8 focus-within:border-emerald-400/40 hover:border-white/12',
          )}
        >
          {prefix && <span className="text-text-tertiary flex-shrink-0">{prefix}</span>}
          <input
            ref={ref}
            className={cn(
              'flex-1 bg-transparent py-2.5 text-sm text-text-primary',
              'font-mono placeholder:text-text-tertiary',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {suffix && <span className="text-text-secondary flex-shrink-0 text-xs font-mono">{suffix}</span>}
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        {hint && !error && <p className="text-[11px] text-text-tertiary">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
