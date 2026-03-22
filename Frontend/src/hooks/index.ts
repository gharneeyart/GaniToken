// ============================================================
// MOCK CONTRACT HOOKS
// Replace each hook body with your wagmi/viem implementation.
// The return shape stays the same — components won't need changes.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { TokenInfo, UserState, ActivityItem, TransactionStatus } from '../types';
import { MAX_SUPPLY, CLAIM_AMOUNT, COOLDOWN_SECONDS } from '../constants';

// --------------- useWallet ---------------
export interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
  isWrongNetwork: boolean;
}

export function useWallet(): UseWalletReturn {
  // ⚡ REPLACE: use wagmi's useAccount, useConnect, useDisconnect
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsConnected(true);
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  return {
    address: isConnected ? '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b' : null,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    chainId: isConnected ? 11155111 : null,
    isWrongNetwork: false,
  };
}

// --------------- useTokenInfo ---------------
export interface UseTokenInfoReturn {
  data: TokenInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTokenInfo(): UseTokenInfoReturn {
  // ⚡ REPLACE: use wagmi useReadContracts for name, symbol, decimals, totalSupply, owner
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TokenInfo | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setData({
      name: 'GaniToken',
      symbol: 'GSK',
      decimals: 18,
      totalSupply: BigInt('3400000000000000000000000'),
      maxSupply: MAX_SUPPLY,
      owner: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      claimAmount: CLAIM_AMOUNT,
      cooldownSeconds: COOLDOWN_SECONDS,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error: null, refetch: fetch };
}

// --------------- useUserState ---------------
export interface UseUserStateReturn {
  userState: UserState;
  isLoading: boolean;
  refetch: () => void;
}

export function useUserState(address: string | null): UseUserStateReturn {
  // ⚡ REPLACE: use wagmi useReadContracts for balanceOf, lastClaimed, owner comparison
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    address: null,
    balance: 0n,
    lastClaimed: 0,
    isOwner: false,
    isConnected: false,
  });

  const fetch = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUserState({
      address,
      balance: BigInt('2500000000000000000000'),
      lastClaimed: Math.floor(Date.now() / 1000) - 3600 * 12, // 12h ago (still on cooldown)
      isOwner: true,
      isConnected: true,
    });
    setIsLoading(false);
  }, [address]);

  useEffect(() => { fetch(); }, [fetch]);

  return { userState, isLoading, refetch: fetch };
}

// --------------- useRequestToken ---------------
export interface UseRequestTokenReturn {
  requestToken: () => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useRequestToken(onSuccess?: () => void): UseRequestTokenReturn {
  // ⚡ REPLACE: use wagmi useWriteContract with requestToken ABI
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const requestToken = useCallback(async () => {
    setStatus({ hash: null, status: 'pending' });
    await new Promise((r) => setTimeout(r, 2000));
    setStatus({ hash: '0xabc123...', status: 'success' });
    onSuccess?.();
  }, [onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { requestToken, status, reset };
}

// --------------- useMint ---------------
export interface UseMintReturn {
  mint: (to: string, amount: bigint) => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useMint(onSuccess?: () => void): UseMintReturn {
  // ⚡ REPLACE: use wagmi useWriteContract with mint ABI
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const mint = useCallback(async (_to: string, _amount: bigint) => {
    setStatus({ hash: null, status: 'pending' });
    await new Promise((r) => setTimeout(r, 2000));
    setStatus({ hash: '0xdef456...', status: 'success' });
    onSuccess?.();
  }, [onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { mint, status, reset };
}

// --------------- useTransfer ---------------
export interface UseTransferReturn {
  transfer: (to: string, amount: bigint) => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useTransfer(onSuccess?: () => void): UseTransferReturn {
  // ⚡ REPLACE: use wagmi useWriteContract with ERC20 transfer ABI
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const transfer = useCallback(async (_to: string, _amount: bigint) => {
    setStatus({ hash: null, status: 'pending' });
    await new Promise((r) => setTimeout(r, 2000));
    setStatus({ hash: '0xghi789...', status: 'success' });
    onSuccess?.();
  }, [onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { transfer, status, reset };
}

// --------------- useActivity ---------------
export interface UseActivityReturn {
  items: ActivityItem[];
  isLoading: boolean;
  refetch: () => void;
}

export function useActivity(address: string | null): UseActivityReturn {
  // ⚡ REPLACE: filter Transfer events + custom RequestToken/Mint events from contract logs
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = Math.floor(Date.now() / 1000);
    setItems([
      { id: '1', type: 'claim', amount: BigInt('100000000000000000000'), address, timestamp: now - 120, txHash: '0xaaa' },
      { id: '2', type: 'mint', amount: BigInt('500000000000000000000000'), address: '0x9f3c...1a2b', timestamp: now - 3600, txHash: '0xbbb' },
      { id: '3', type: 'transfer_out', amount: BigInt('250000000000000000000'), address: '0x5e6f...3d2a', timestamp: now - 10800, txHash: '0xccc' },
      { id: '4', type: 'transfer_in', amount: BigInt('500000000000000000000'), address: '0x4a5b...2c1d', timestamp: now - 86400, txHash: '0xddd' },
      { id: '5', type: 'claim', amount: BigInt('100000000000000000000'), address, timestamp: now - 90000, txHash: '0xeee' },
    ]);
    setIsLoading(false);
  }, [address]);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, isLoading, refetch: fetch };
}

// --------------- useCooldown ---------------
export interface UseCooldownReturn {
  canClaim: boolean;
  remainingSeconds: number;
  formattedCountdown: string;
}

export function useCooldown(lastClaimed: number, cooldownSeconds: number): UseCooldownReturn {
  // This hook is purely client-side — no contract call needed here
  // It recomputes every second based on the lastClaimed timestamp from useUserState
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const compute = () => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const elapsed = nowSeconds - lastClaimed;
      const rem = Math.max(0, cooldownSeconds - elapsed);
      setRemaining(rem);
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [lastClaimed, cooldownSeconds]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return {
    canClaim: remaining === 0,
    remainingSeconds: remaining,
    formattedCountdown: remaining > 0 ? parts.join(' ') : 'Ready',
  };
}
