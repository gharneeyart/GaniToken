import { useTokenContract } from "../useContract";
import { useCallback, useState } from "react";
import { ErrorDecoder } from "ethers-decode-error";
import type { TransactionStatus } from "../../types";

const errorDecoder = ErrorDecoder.create();

export interface UseRequestTokenReturn {
  requestToken: () => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useRequestToken(onSuccess?: () => void): UseRequestTokenReturn {
  const tokenContract = useTokenContract(true);
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const requestToken = useCallback(async () => {
    if (!tokenContract) return;
    try {
      setStatus({ hash: null, status: 'pending' });
      const tx = await tokenContract.requestToken();
      await tx.wait();
      setStatus({ hash: tx.hash, status: 'success' });
      onSuccess?.();
    } catch (error: any) {
        const decodedError = await errorDecoder.decode(error);
        setStatus({ hash: null, status: 'error', errorMessage: decodedError.reason ?? 'Transaction failed' });
    }
  }, [tokenContract, onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { requestToken, status, reset };
}

export interface UseMintReturn {
  mint: (to: string, amount: bigint) => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useMint(onSuccess?: () => void): UseMintReturn {
  const tokenContract = useTokenContract(true);
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const mint = useCallback(async (to: string, amount: bigint) => {
    if (!tokenContract) return;
    try {
      setStatus({ hash: null, status: 'pending' });
      const tx = await tokenContract.mint(to, amount);
      await tx.wait();
      setStatus({ hash: tx.hash, status: 'success' });
      onSuccess?.();
    } catch (error: any) {
        const decodedError = await errorDecoder.decode(error);
        setStatus({ hash: null, status: 'error', errorMessage: decodedError.reason ?? 'Transaction failed' });
    }
  }, [tokenContract, onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { mint, status, reset };
}

export interface UseTransferReturn {
  transfer: (to: string, amount: bigint) => Promise<void>;
  status: TransactionStatus;
  reset: () => void;
}

export function useTransfer(onSuccess?: () => void): UseTransferReturn {
  const tokenContract = useTokenContract(true);
  const [status, setStatus] = useState<TransactionStatus>({ hash: null, status: 'idle' });

  const transfer = useCallback(async (to: string, amount: bigint) => {
    if (!tokenContract) return;
    try {
      setStatus({ hash: null, status: 'pending' });
      const tx = await tokenContract.transfer(to, amount);
      await tx.wait();
      setStatus({ hash: tx.hash, status: 'success' });
      onSuccess?.();
    } catch (error: any) {
      setStatus({ hash: null, status: 'error', errorMessage: error?.reason ?? 'Transaction failed' });
    }
  }, [tokenContract, onSuccess]);

  const reset = useCallback(() => setStatus({ hash: null, status: 'idle' }), []);

  return { transfer, status, reset };
}