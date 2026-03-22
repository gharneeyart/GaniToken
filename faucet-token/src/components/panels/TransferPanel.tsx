import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TxStatus } from '../ui/TxStatus';
import { Badge } from '../ui/Badge';
import { isValidAddress, formatTokenAmount } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useTransfer } from '../../hooks/specific/useWriteTokenContract';
import { useReadToken } from '../../hooks/specific/useReadTokenContract';
import useRunners from '../../hooks/useRunner';

interface TransferPanelProps {
  onSuccess: () => void;
}

export function TransferPanel({ onSuccess }: TransferPanelProps) {
  const {isConnected} = useRunners();
  const {symbol, decimals, balance} = useReadToken();
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');

  const { transfer, status, reset } = useTransfer(() => {
    toast.success('Transfer sent successfully!');
    setRecipient('');
    setAmountStr('');
    onSuccess();
    setTimeout(reset, 4000);
  });

  const balanceFormatted = formatTokenAmount(balance, decimals, 2);

  const recipientError = recipient && !isValidAddress(recipient) ? 'Invalid address' : undefined;
  const amountNum = parseFloat(amountStr);
  const amountBig = amountStr && !isNaN(amountNum)
    ? BigInt(Math.floor(amountNum * 10 ** decimals))
    : 0n;
  const amountError =
    amountStr && isNaN(amountNum)
      ? 'Invalid amount'
      : amountBig > balance
      ? 'Insufficient balance'
      : undefined;

  const canTransfer =
    isConnected &&
    isValidAddress(recipient) &&
    amountBig > 0n &&
    amountBig <= balance &&
    !amountError &&
    status.status !== 'pending';

  const handleTransfer = async () => {
    if (!canTransfer) return;
    try {
      await transfer(recipient, amountBig);
    } catch {
      toast.error('Transfer failed. Please try again.');
    }
  };

  const handleMax = () => {
    const maxAmt = Number(balance) / 10 ** decimals;
    setAmountStr(maxAmt.toString());
  };

  return (
    <Card glow="amber" className="flex flex-col gap-5">
      <CardHeader>
        <CardTitle dot="amber">Transfer</CardTitle>
        <Badge variant="amber">transfer()</Badge>
      </CardHeader>

      {/* Balance display */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
          Available Balance
        </span>
        <span className="text-sm font-mono font-semibold text-amber-400">
          {isConnected ? `${balanceFormatted} ${symbol}` : '—'}
        </span>
      </div>

      <div className="space-y-3">
        <Input
          label="Recipient Address"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          error={recipientError}
          disabled={!isConnected || status.status === 'pending'}
        />
        <div className="relative">
          <Input
            label="Amount"
            placeholder="0"
            type="number"
            min="0"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            suffix={
              <button
                onClick={handleMax}
                className="text-amber-400 hover:text-amber-300 font-mono text-[10px] transition-colors"
              >
                MAX
              </button>
            }
            error={amountError}
            hint={`Balance: ${balanceFormatted} ${symbol}`}
            disabled={!isConnected || status.status === 'pending'}
          />
        </div>
      </div>

      <TxStatus status={status} />

      <Button
        variant="amber"
        size="lg"
        fullWidth
        isLoading={status.status === 'pending'}
        loadingText="Sending transfer…"
        disabled={!canTransfer}
        onClick={handleTransfer}
      >
        <ArrowUpRight className="w-4 h-4" />
        Send {amountStr ? `${amountStr} ${symbol}` : 'Tokens'}
      </Button>
    </Card>
  );
}
