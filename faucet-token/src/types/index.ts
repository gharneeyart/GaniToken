// ============================================================
// TYPES — All contract-related types are defined here
// Plug in your wagmi/viem types when integrating
// ============================================================

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  maxSupply: bigint;
  owner: string;
  claimAmount: bigint;
  cooldownSeconds: number;
}

export interface UserState {
  address: string | null;
  balance: bigint;
  lastClaimed: number; // unix timestamp in seconds, 0 if never claimed
  isOwner: boolean;
  isConnected: boolean;
}

export interface TransactionStatus {
  hash: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  errorMessage?: string;
}

export interface ActivityItem {
  id: string;
  type: 'claim' | 'mint' | 'transfer_in' | 'transfer_out';
  amount: bigint;
  address: string;
  timestamp: number;
  txHash: string;
}

// Tab type for the activity feed
export type ActivityTab = 'all' | 'claims' | 'mints' | 'transfers';
