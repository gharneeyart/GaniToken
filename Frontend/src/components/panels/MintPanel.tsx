import { useState } from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TxStatus } from '../ui/TxStatus';
import { Badge } from '../ui/Badge';
import { SupplyBar } from '../ui/SupplyBar';
import { isValidAddress, formatTokenAmount, supplyPercent } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useMint } from '../../hooks/specific/useWriteTokenContract';
import useRunners from '../../hooks/useRunner';
import { useTokenContext } from '../../contexts/TokenContext';



interface MintPanelProps {
  onSuccess: () => void;
}

export function MintPanel({ onSuccess }: MintPanelProps) {
  const {address, isConnected, } = useRunners();
  const {owner, symbol, decimals, maxSupply, totalSupply} = useTokenContext();
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');

  const isOwner = address?.toLowerCase() === owner?.toLowerCase(); 

  const { mint, status, reset } = useMint(() => {
    toast.success('Tokens minted successfully!');
    setRecipient('');
    setAmountStr('');
    onSuccess();
    setTimeout(reset, 4000);
  });

 
  const remaining = maxSupply - totalSupply;
  
  const remainingFormatted = formatTokenAmount(remaining, decimals, 0);
  const pct = supplyPercent(totalSupply, maxSupply);

  const recipientError = recipient && !isValidAddress(recipient) ? 'Invalid address' : undefined;
  const amountNum = parseFloat(amountStr);
  const amountBig = amountStr && !isNaN(amountNum)
    ? BigInt(Math.floor(amountNum * 10 ** decimals))
    : 0n;
  const amountError =
    amountStr && isNaN(amountNum)
      ? 'Invalid amount'
      : amountBig > remaining
      ? 'Exceeds remaining supply'
      : undefined;

  const canMint =
    isConnected &&
    isOwner &&
    isValidAddress(recipient) &&
    amountBig > 0n &&
    !amountError &&
    status.status !== 'pending';

  const handleMint = async () => {
    if (!canMint) return;
    try {
      await mint(recipient, amountBig);
    } catch {
      toast.error('Mint failed. Please try again.');
    }
  };

  return (
    <Card glow="violet" className="flex flex-col gap-5">
      <CardHeader>
        <CardTitle dot="violet">Mint Tokens</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="violet">
            <Crown className="w-2.5 h-2.5 mr-1" />
            Owner
          </Badge>
        </div>
      </CardHeader>

      <div className="space-y-2">
        <SupplyBar percent={pct} />
        <p className="text-[10px] font-mono text-text-tertiary">
          {remainingFormatted} {symbol} remaining to mint
        </p>
      </div>

      <div className="space-y-3">
        <Input
          label="Recipient Address"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          error={recipientError}
          disabled={status.status === 'pending'}
        />
        <Input
          label="Amount"
          placeholder="0"
          type="number"
          min="0"
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          suffix={symbol}
          error={amountError}
          hint={`Max: ${remainingFormatted} ${symbol}`}
          disabled={status.status === 'pending'}
        />
      </div>

      <TxStatus status={status} />

      <Button
        variant="violet"
        size="lg"
        fullWidth
        isLoading={status.status === 'pending'}
        loadingText="Minting tokens…"
        disabled={!canMint}
        onClick={handleMint}
      >
        <Sparkles className="w-4 h-4" />
        Mint {amountStr ? `${amountStr} ${symbol}` : 'Tokens'}
      </Button>
    </Card>
  );
}
