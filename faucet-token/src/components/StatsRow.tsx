import { Coins, TrendingUp, Clock, Crown } from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { formatTokenAmount, supplyPercent } from '../lib/utils';
import type { TokenInfo, UserState } from '../types';

interface StatsRowProps {
  tokenInfo: TokenInfo | null;
  userState: UserState;
  isLoading: boolean;
}

export function StatsRow({ tokenInfo, userState, isLoading }: StatsRowProps) {
  const totalSupply = tokenInfo ? formatTokenAmount(tokenInfo.totalSupply, tokenInfo.decimals, 0) : '—';
  const balance = formatTokenAmount(userState.balance, 18, 2);
  const pct = tokenInfo ? supplyPercent(tokenInfo.totalSupply, tokenInfo.maxSupply) : 0;
  const symbol = tokenInfo?.symbol ?? 'GSK';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Your Balance"
        value={`${balance} ${symbol}`}
        sub="Available to transfer"
        icon={Coins}
        accent="emerald"
        isLoading={isLoading || !userState.isConnected}
      />
      <StatCard
        label="Total Supply"
        value={totalSupply}
        sub={`${pct.toFixed(1)}% of max supply`}
        icon={TrendingUp}
        accent="amber"
        isLoading={isLoading}
      />
      <StatCard
        label="Claim Amount"
        value={`100 ${symbol}`}
        sub="Per wallet per 24 hours"
        icon={Clock}
        accent="neutral"
        isLoading={isLoading}
      />
      <StatCard
        label="Contract Owner"
        value={userState.isOwner ? 'You' : 'Other'}
        sub={userState.isOwner ? 'Mint access enabled' : 'No mint access'}
        icon={Crown}
        accent={userState.isOwner ? 'violet' : 'neutral'}
        isLoading={isLoading || !userState.isConnected}
      />
    </div>
  );
}
