import { StatsRow } from './StatsRow';
import { FaucetPanel } from './panels/FaucetPanel';
import { MintPanel } from './panels/MintPanel';
import { TransferPanel } from './panels/TransferPanel';
import { TokenInfoPanel } from './panels/TokenInfoPanel';
import { ActivityFeed } from './panels/ActivityFeed';
import useRunners from '../hooks/useRunner';
import { useActivity} from '../hooks/specific/useReadTokenContract';
import { useEffect } from 'react';
import { useTokenContext } from '../contexts/TokenContext';

export function Dashboard() {
  const { address } = useRunners();
  const { owner, refetch } = useTokenContext();
  const { refetch: refetchActivity } = useActivity();

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

   useEffect(() => {
    refetch();
    refetchActivity();
  }, [address]);

  return (
    <div className="space-y-4 animate-fade-in">
      <StatsRow />

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
        <FaucetPanel onSuccess={refetch} />
        <TransferPanel onSuccess={refetch} />
        {isOwner && <MintPanel onSuccess={refetch} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={isOwner ? 'lg:col-span-2' : 'hidden'}>
          <TokenInfoPanel />
        </div>
        <div className={isOwner ? 'lg:col-span-3' : 'lg:col-span-5'}>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}