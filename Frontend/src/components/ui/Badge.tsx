import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'violet' | 'neutral' | 'red';
  size?: 'sm' | 'xs';
  className?: string;
}

const variants = {
  emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  amber: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  violet: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  neutral: 'bg-white/5 text-text-secondary border-white/10',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border rounded font-mono font-medium',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[9px] px-1.5 py-0.5',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
