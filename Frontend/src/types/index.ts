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


export type ActivityTab = 'all' | 'claims' | 'mints' | 'transfers';
