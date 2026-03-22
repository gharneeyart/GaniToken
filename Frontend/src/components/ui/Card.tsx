import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'amber' | 'violet' | 'none';
  onClick?: () => void;
}

const glowMap = {
  emerald: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)] hover:border-emerald-400/20',
  amber: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.08)] hover:border-amber-400/20',
  violet: 'hover:shadow-[0_0_30px_rgba(167,139,250,0.08)] hover:border-violet-400/20',
  none: '',
};

export function Card({ children, className, glow = 'none', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-5 transition-all duration-300',
        glow !== 'none' && glowMap[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  dot?: 'emerald' | 'amber' | 'violet' | 'neutral';
  className?: string;
}

const dotColors = {
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  neutral: 'bg-white/30',
};

export function CardTitle({ children, dot, className }: CardTitleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            dotColors[dot]
          )}
        />
      )}
      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-secondary">
        {children}
      </span>
    </div>
  );
}
