import { Droplets, Timer, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TxStatus } from '../ui/TxStatus';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { useCooldown, useRequestToken } from '../../hooks';
import type { UserState, TokenInfo } from '../../types';
import toast from 'react-hot-toast';

interface FaucetPanelProps {
  userState: UserState;
  tokenInfo: TokenInfo | null;
  onSuccess: () => void;
}

export function FaucetPanel({ userState, tokenInfo, onSuccess }: FaucetPanelProps) {
  const cooldown = useCooldown(
    userState.lastClaimed,
    tokenInfo?.cooldownSeconds ?? 86400
  );

  const { requestToken, status, reset } = useRequestToken(() => {
    toast.success('Tokens claimed successfully!');
    onSuccess();
    setTimeout(reset, 4000);
  });

  const symbol = tokenInfo?.symbol ?? 'GSK';
  const isConnected = userState.isConnected;

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!cooldown.canClaim) {
      toast.error(`Try again in ${cooldown.formattedCountdown}`);
      return;
    }
    try {
      await requestToken();
    } catch {
      toast.error('Claim failed. Please try again.');
    }
  };

  return (
    <Card glow="emerald" className="flex flex-col gap-5">
      <CardHeader>
        <CardTitle dot="emerald">Faucet</CardTitle>
        <Badge variant="emerald">requestToken()</Badge>
      </CardHeader>

      {/* Claim amount display */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold text-gradient-emerald">100</span>
          <span className="font-mono text-lg text-text-secondary">{symbol}</span>
        </div>
        <p className="text-xs text-text-tertiary font-mono">
          claimable every 24 hours · per wallet address
        </p>
      </div>

      {/* Cooldown indicator */}
      {isConnected && (
        <div
          className={cn(
            'rounded-xl px-4 py-3 border flex items-start gap-3 transition-all duration-300',
            cooldown.canClaim
              ? 'bg-emerald-400/5 border-emerald-400/20'
              : 'bg-amber-400/5 border-amber-400/20'
          )}
        >
          {cooldown.canClaim ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono text-emerald-400 font-medium">Ready to claim</p>
                <p className="text-[10px] font-mono text-text-tertiary mt-0.5">
                  Your wallet is eligible for tokens
                </p>
              </div>
            </>
          ) : (
            <>
              <Timer className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                  Retry in
                </p>
                <p className="text-base font-mono font-semibold text-amber-400 mt-0.5 tabular-nums">
                  {cooldown.formattedCountdown}
                </p>
                <p className="text-[10px] font-mono text-text-tertiary mt-1">
                  Countdown is specific to your wallet
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Not connected state */}
      {!isConnected && (
        <div className="rounded-xl px-4 py-3 border border-white/8 bg-white/3 flex items-center gap-3">
          <Droplets className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <p className="text-xs font-mono text-text-tertiary">
            Connect wallet to check eligibility
          </p>
        </div>
      )}

      {/* TX Status */}
      <TxStatus status={status} />

      {/* Action button */}
      <Button
        variant="emerald"
        size="lg"
        fullWidth
        isLoading={status.status === 'pending'}
        loadingText="Claiming tokens…"
        disabled={!isConnected || (!cooldown.canClaim && status.status !== 'pending')}
        onClick={handleClaim}
      >
        <Droplets className="w-4 h-4" />
        {cooldown.canClaim ? 'Claim 100 GSK' : `Retry in ${cooldown.formattedCountdown}`}
      </Button>
    </Card>
  );
}
