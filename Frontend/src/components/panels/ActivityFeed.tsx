import { useState } from 'react';
import {
  Droplets,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { shortenAddress, formatTokenAmount, timeAgo } from '../../lib/utils';
import { BLOCK_EXPLORER_URL } from '../../constants';
import { cn } from '../../lib/utils';
import type { ActivityItem, ActivityTab } from '../../types';
import { useActivity } from '../../hooks/specific/useReadTokenContract';

const TABS: { key: ActivityTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'claims', label: 'Claims' },
  { key: 'mints', label: 'Mints' },
  { key: 'transfers', label: 'Transfers' },
];

const typeConfig = {
  claim: {
    icon: Droplets,
    label: 'Claimed',
    iconClass: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    amountClass: 'text-emerald-400',
    sign: '+',
  },
  mint: {
    icon: Sparkles,
    label: 'Minted',
    iconClass: 'text-violet-400',
    iconBg: 'bg-violet-400/10',
    amountClass: 'text-violet-400',
    sign: '+',
  },
  transfer_out: {
    icon: ArrowUpRight,
    label: 'Sent',
    iconClass: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    amountClass: 'text-amber-400',
    sign: '−',
  },
  transfer_in: {
    icon: ArrowDownLeft,
    label: 'Received',
    iconClass: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    amountClass: 'text-emerald-400',
    sign: '+',
  },
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const cfg = typeConfig[item.type];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 group">
      <div className={cn('w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center', cfg.iconBg)}>
        <Icon className={cn('w-3.5 h-3.5', cfg.iconClass)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-text-primary">{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-mono text-text-tertiary truncate">
            {shortenAddress(item.address, 4)}
          </span>
          <span className="text-[10px] text-text-tertiary/50">·</span>
          <span className="text-[10px] font-mono text-text-tertiary flex-shrink-0">
            {timeAgo(item.timestamp)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={cn('text-xs font-mono font-semibold', cfg.amountClass)}>
          {cfg.sign}{formatTokenAmount(item.amount, 18, 0)} GSK
        </span>
        <a
          href={`${BLOCK_EXPLORER_URL}/tx/${item.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-text-secondary"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const { items, isLoading, refetch } = useActivity();
  const [activeTab, setActiveTab] = useState<ActivityTab>('all');

  const filtered = items.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'claims') return item.type === 'claim';
    if (activeTab === 'mints') return item.type === 'mint';
    if (activeTab === 'transfers') return item.type === 'transfer_in' || item.type === 'transfer_out';
    return true;
  });

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle dot="neutral">
          <Activity className="w-3 h-3 mr-1 inline" />
          Activity
        </CardTitle>
        <button
          onClick={refetch}
          className="p-1.5 rounded-lg hover:bg-white/8 transition-colors text-text-tertiary hover:text-text-secondary"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <div className="flex items-center gap-1 p-0.5 bg-white/3 rounded-xl border border-white/6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-[10px] text-[11px] font-mono transition-all duration-200',
              activeTab === tab.key
                ? 'bg-white/10 text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[160px]">
        {isLoading ? (
          <div className="space-y-3 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-16 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
            <Activity className="w-6 h-6 text-text-tertiary/40" />
            <p className="text-xs text-text-tertiary font-mono">No activity yet</p>
          </div>
        ) : (
          <div>
            {filtered.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {!isLoading && filtered.length > 0 && (
        <div className="flex justify-end">
          <Badge variant="neutral">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</Badge>
        </div>
      )}
    </Card>
  );
}
