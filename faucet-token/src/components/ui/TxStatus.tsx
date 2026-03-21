import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { TransactionStatus } from '../../types';
import { BLOCK_EXPLORER_URL } from '../../constants';

interface TxStatusProps {
  status: TransactionStatus;
  className?: string;
}

export function TxStatus({ status, className }: TxStatusProps) {
  if (status.status === 'idle') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-mono',
        'border animate-slide-up',
        status.status === 'pending' && 'bg-amber-400/5 border-amber-400/20 text-amber-400',
        status.status === 'success' && 'bg-emerald-400/5 border-emerald-400/20 text-emerald-400',
        status.status === 'error' && 'bg-red-500/5 border-red-500/20 text-red-400',
        className
      )}
    >
      {status.status === 'pending' && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
          <span>Transaction pending…</span>
        </>
      )}
      {status.status === 'success' && (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Transaction confirmed</span>
          {status.hash && (
            <a
              href={`${BLOCK_EXPLORER_URL}/tx/${status.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              View <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </>
      )}
      {status.status === 'error' && (
        <>
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{status.errorMessage ?? 'Transaction failed'}</span>
        </>
      )}
    </div>
  );
}
