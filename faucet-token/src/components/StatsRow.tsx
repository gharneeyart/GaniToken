import { Coins, TrendingUp, Clock, Crown } from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { formatTokenAmount, supplyPercent } from '../lib/utils';
import { useReadToken } from '../hooks/specific/useReadTokenContract';
import useRunners from '../hooks/useRunner';

export function StatsRow() {
  const {address} = useRunners();
  const {
    balance,
    totalSupply,
    maxSupply,
    symbol,
    decimals,
    owner,
    claimAmount,
    isLoading,
  } = useReadToken();

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();
  const pct = supplyPercent(totalSupply, maxSupply);
  console.log(decimals);
  console.log(symbol);
  
  

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Your Balance"
        value={`${formatTokenAmount(balance, decimals, 2)} ${symbol}`}
        sub="Available to transfer"
        icon={Coins}
        accent="emerald"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Supply"
        value={formatTokenAmount(totalSupply, decimals, 2)}
        sub={`${pct.toFixed(1)}% of max supply`}
        icon={TrendingUp}
        accent="amber"
        isLoading={isLoading}
      />
      <StatCard
        label="Claim Amount"
        value={`${formatTokenAmount(claimAmount, decimals, 0)} ${symbol}`}
        sub="Per wallet per 24 hours"
        icon={Clock}
        accent="neutral"
        isLoading={isLoading}
      />
      <StatCard
        label={isOwner ? 'Contract Owner' : 'Visitor'}
        value={isOwner ? 'You' : 'Other'}
        sub={isOwner ? 'Mint access enabled' : 'No mint access'}
        icon={Crown}
        accent={isOwner ? 'violet' : 'neutral'}
        isLoading={isLoading}
      />
    </div>
  );
}