import { Wallet, Zap, Shield, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const features = [
  { icon: Zap, text: 'Claim 100 GSK every 24 hours' },
  { icon: Shield, text: 'Standard ERC20 token on Lisk Sepolia' },
  { icon: Clock, text: 'Per-wallet cooldown tracking' },
];

export function ConnectPrompt() {
  const { open, } = useAppKit();
  const { status } = useAppKitAccount();

  const isConnecting = status === 'connecting' || status === 'reconnecting';

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-16 text-center animate-fade-in">
      {/* Glow orb background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-surface-3 border border-emerald-400/20 flex items-center justify-center">
          <Wallet className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2 tracking-tight">
        Connect your wallet
      </h2>
      <p className="text-sm text-text-secondary font-body max-w-sm mb-8 leading-relaxed">
        Connect to Lisk Sepolia testnet to claim GaniToken Faucet
      </p>

      {/* Features */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {features.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-card"
          >
            <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-mono text-text-secondary whitespace-nowrap">{text}</span>
          </div>
        ))}
      </div>

      <Button
        variant="emerald"
        size="lg"
        isLoading={isConnecting}
        loadingText="Connecting…"
        onClick={() => open()}
        className="px-8"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    </div>
  );
}