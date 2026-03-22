import { createContext, useContext, type ReactNode } from 'react';
import { useReadToken } from '../hooks/specific/useReadTokenContract';

type TokenContextType = ReturnType<typeof useReadToken>;

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: ReactNode }) {
  const tokenData = useReadToken();

  return (
    <TokenContext.Provider value={tokenData}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenContext() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokenContext must be used inside TokenProvider');
  return ctx;
}