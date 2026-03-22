import { Info, ExternalLink, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SupplyRing } from '../ui/SupplyBar';
import { Skeleton } from '../ui/Skeleton';
import { shortenAddress, formatTokenAmount, supplyPercent } from '../../lib/utils';
import { BLOCK_EXPLORER_URL, CONTRACT_ADDRESS } from '../../constants';
import toast from 'react-hot-toast';
import { useTokenContext } from '../../contexts/TokenContext';



function InfoRow({
  label,
  value,
  mono = false,
  isLoading = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
        {label}
      </span>
      {isLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <span className={`text-xs ${mono ? 'font-mono' : 'font-body'} text-text-primary`}>
          {value}
        </span>
      )}
    </div>
  );
}

export function TokenInfoPanel() {
  const {owner,name, isLoading, claimAmount, decimals, symbol, maxSupply, totalSupply} = useTokenContext();
  const pct = supplyPercent(totalSupply, maxSupply);


  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    toast.success('Contract address copied!');
  };

  return (
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <CardTitle dot="neutral">Token Info</CardTitle>
        <Badge variant="neutral">
          <Info className="w-2.5 h-2.5 mr-1" />
          Read
        </Badge>
      </CardHeader>

      {/* Supply ring + basic info in a row */}
      <div className="flex items-center gap-5">
        {isLoading ? (
          <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
        ) : (
          <SupplyRing percent={pct} size={80} />
        )}
        <div className="flex-1 min-w-0 space-y-1.5">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-16" />
            </>
          ) : (
            <>
              <p className="font-display text-lg font-semibold text-text-primary leading-none">
                {name || '—'}
              </p>
              <p className="font-mono text-sm text-emerald-400">{symbol || '—'}</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-0">
        <InfoRow
          label="Decimals"
          value={decimals.toString()}
          mono
          isLoading={isLoading}
        />
        <InfoRow
          label="Total Supply"
          value={`${formatTokenAmount(totalSupply, decimals, 0)} ${symbol}`}
          mono
          isLoading={isLoading}
        />
        <InfoRow
          label="Max Supply"
          value={`${formatTokenAmount(maxSupply, decimals, 0)} ${symbol}`}
          mono
          isLoading={isLoading}
        />
        <InfoRow
          label="Claim Amount"
          value={`${formatTokenAmount(claimAmount, decimals, 0)} ${symbol}`}
          mono
          isLoading={isLoading}
        />
        <InfoRow
          label="Owner"
          value={owner ? shortenAddress(owner, 4) : '—'}
          isLoading={isLoading}
        />
      </div>

      {/* Contract address link */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/3 border border-white/8">
        <span className="font-mono text-[10px] text-text-tertiary truncate mr-2">
          {shortenAddress(CONTRACT_ADDRESS, 6)}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={copyAddress}
            className="p-1 rounded hover:bg-white/8 transition-colors text-text-tertiary hover:text-text-secondary"
          >
            <Copy className="w-3 h-3" />
          </button>
          <a
            href={`${BLOCK_EXPLORER_URL}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-white/8 transition-colors text-text-tertiary hover:text-text-secondary"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}
