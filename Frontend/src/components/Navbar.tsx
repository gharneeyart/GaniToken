import { Wallet, LogOut, AlertTriangle, Zap } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { shortenAddress } from '../lib/utils';
import { SUPPORTED_CHAIN_NAME } from '../constants';
import useRunners from '../hooks/useRunner';

export function Navbar() {
  const {address, isConnected, isWrongNetwork, disconnect, connect, isConnecting} = useRunners();
  

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-b-2xl border-t-0 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-base font-bold text-text-primary tracking-tight">
                Gani<span className="text-emerald-400">Token</span>
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">

            {isConnected && (
              <>
                {isWrongNetwork ? (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/8 border border-amber-400/20 rounded-lg px-3 py-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Wrong network
                  </div>
                ) : (
                  <Badge variant="emerald" className="hidden sm:inline-flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    {SUPPORTED_CHAIN_NAME}
                  </Badge>
                )}
              </>
            )}

            {isConnected && address ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-2 glass-card rounded-xl px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-text-secondary">
                    {shortenAddress(address, 4)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="px-2 sm:px-3"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="emerald"
                size="sm"
                isLoading={isConnecting}
                loadingText="Connecting…"
                onClick={connect}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}