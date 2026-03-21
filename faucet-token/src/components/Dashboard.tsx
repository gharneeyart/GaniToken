import { StatsRow } from './StatsRow';
import { FaucetPanel } from './panels/FaucetPanel';
import { MintPanel } from './panels/MintPanel';
import { TransferPanel } from './panels/TransferPanel';
import { TokenInfoPanel } from './panels/TokenInfoPanel';
import { ActivityFeed } from './panels/ActivityFeed';
import { useTokenInfo, useUserState, useActivity } from '../hooks';

interface DashboardProps {
  address: string;
}

export function Dashboard({ address }: DashboardProps) {
  const { data: tokenInfo, isLoading: tokenLoading, refetch: refetchToken } = useTokenInfo();
  const { userState, isLoading: userLoading, refetch: refetchUser } = useUserState(address);
  const { items: activity, isLoading: activityLoading, refetch: refetchActivity } = useActivity(address);

  const handleSuccess = () => {
    refetchToken();
    refetchUser();
    refetchActivity();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats row */}
      <StatsRow
        tokenInfo={tokenInfo}
        userState={userState}
        isLoading={tokenLoading || userLoading}
      />

      {/* Main grid: 3 columns on lg, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FaucetPanel
          userState={userState}
          tokenInfo={tokenInfo}
          onSuccess={handleSuccess}
        />
        <TransferPanel
          userState={userState}
          tokenInfo={tokenInfo}
          onSuccess={handleSuccess}
        />
        <MintPanel
          userState={userState}
          tokenInfo={tokenInfo}
          onSuccess={handleSuccess}
        />
      </div>

      {/* Bottom grid: token info + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <TokenInfoPanel tokenInfo={tokenInfo} isLoading={tokenLoading} />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed
            items={activity}
            isLoading={activityLoading}
            onRefresh={refetchActivity}
          />
        </div>
      </div>
    </div>
  );
}
