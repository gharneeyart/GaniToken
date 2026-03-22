import { StatsRow } from './StatsRow';
import { FaucetPanel } from './panels/FaucetPanel';
import { MintPanel } from './panels/MintPanel';
import { TransferPanel } from './panels/TransferPanel';
import { TokenInfoPanel } from './panels/TokenInfoPanel';
import { ActivityFeed } from './panels/ActivityFeed';
import { useTokenInfo, useUserState } from '../hooks';
import useRunners from '../hooks/useRunner';
import { useReadToken } from '../hooks/specific/useReadTokenContract';

// interface DashboardProps {
//   address: string;
// }

export function Dashboard() {
  const {address} = useRunners();

  const {owner} = useReadToken();
  const { data: tokenInfo, isLoading: tokenLoading, refetch: refetchToken } = useTokenInfo();
  const { userState, isLoading: userLoading, refetch: refetchUser } = useUserState(address);

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

  const handleSuccess = () => {
    refetchToken();
    refetchUser();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats row */}
      <StatsRow/>

      {/* Main grid: 3 columns on lg, 1 on mobile */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isOwner ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-4`}>
        <FaucetPanel
          onSuccess={handleSuccess}
        />
        <TransferPanel
          onSuccess={handleSuccess}
        />
        {isOwner ? 
        <MintPanel
          onSuccess={handleSuccess}
        /> : ''}
        
      </div>

      {/* Bottom grid: token info + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {isOwner ? 
        <div className="lg:col-span-2">
          <TokenInfoPanel />
        </div>
        : ''}
        <div className={`${isOwner ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
          <ActivityFeed/>
        </div>
      </div>
    </div>
  );
}
