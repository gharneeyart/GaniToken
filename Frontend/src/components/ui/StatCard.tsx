import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  accent?: 'emerald' | 'amber' | 'violet' | 'neutral';
  isLoading?: boolean;
  className?: string;
}

const accentMap = {
  emerald: {
    value: 'text-emerald-400',
    icon: 'text-emerald-400 bg-emerald-400/10',
    border: 'border-t border-t-emerald-400/20',
  },
  amber: {
    value: 'text-amber-400',
    icon: 'text-amber-400 bg-amber-400/10',
    border: 'border-t border-t-amber-400/20',
  },
  violet: {
    value: 'text-violet-400',
    icon: 'text-violet-400 bg-violet-400/10',
    border: 'border-t border-t-violet-400/20',
  },
  neutral: {
    value: 'text-text-primary',
    icon: 'text-text-secondary bg-white/5',
    border: '',
  },
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'neutral',
  isLoading = false,
  className,
}: StatCardProps) {
  const a = accentMap[accent];

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300',
        a.border,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-tertiary">
          {label}
        </span>
        {Icon && (
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', a.icon)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </>
      ) : (
        <>
          <span className={cn('font-mono text-xl font-semibold leading-none', a.value)}>
            {value}
          </span>
          {sub && (
            <span className="text-[11px] text-text-tertiary font-mono">{sub}</span>
          )}
        </>
      )}
    </div>
  );
}
