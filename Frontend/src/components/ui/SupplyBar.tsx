import { cn } from '../../lib/utils';

interface SupplyBarProps {
  percent: number;
  className?: string;
}

export function SupplyBar({ percent, className }: SupplyBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-text-tertiary">
          {clamped.toFixed(1)}% minted
        </span>
        <span className="text-[10px] font-mono text-text-tertiary">
          MAX 10,000,000
        </span>
      </div>
    </div>
  );
}

interface SupplyRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function SupplyRing({ percent, size = 80, strokeWidth = 5, className }: SupplyRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#emeraldGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-mono font-semibold text-text-primary leading-none">
          {percent.toFixed(0)}%
        </span>
        <span className="text-[9px] font-mono text-text-tertiary mt-0.5">minted</span>
      </div>
    </div>
  );
}
