import { useTokenContract } from "../useContract";
import { useCallback, useEffect, useState } from "react";
import useRunners from "../useRunner";
import type { ActivityItem } from "../../types";
import { BLOCK_NUMBER } from "../../constants";

export const useReadToken = () => {
  const tokenContract = useTokenContract();
  const { address } = useRunners();

  const [decimals, setDecimals] = useState<number>(18);
  const [balance, setBalance] = useState<bigint>(0n);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [maxSupply, setMaxSupply] = useState<bigint>(0n);
  const [claimAmount, setClaimAmount] = useState<bigint>(0n);
  const [cooldown, setCooldown] = useState<bigint>(0n);
  const [lastClaimed, setLastClaimed] = useState<bigint>(0n);
  const [owner, setOwner] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!tokenContract || !address) return;

    try {
      setIsLoading(true);

      const [
        _balance,
        _totalSupply,
        _maxSupply,
        _claimAmount,
        _cooldown,
        _lastClaimed,
        _owner,
        _name,
        _symbol,
        _decimals,
      ] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.totalSupply(),
        tokenContract.MAX_SUPPLY(),
        tokenContract.CLAIM_AMOUNT(),
        tokenContract.COOLDOWN(),
        tokenContract.lastClaimed(address),
        tokenContract.owner(),
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
      ]);

      setBalance(_balance);
      setTotalSupply(_totalSupply);
      setMaxSupply(_maxSupply);
      setClaimAmount(_claimAmount);
      setCooldown(_cooldown);
      setLastClaimed(_lastClaimed);
      setOwner(_owner);
      setName(_name);
      setSymbol(_symbol);
      setDecimals(Number(_decimals));
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenContract, address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    decimals,
    balance,
    totalSupply,
    maxSupply,
    claimAmount,
    cooldown,
    lastClaimed,
    owner,
    name,
    symbol,
    isLoading,
    refetch: fetchData,
  };
};


export const useActivity = () => {
  const tokenContract = useTokenContract();
  const { address } = useRunners();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    if (!tokenContract || !address) return;
    try {
      setIsLoading(true);

      const sentFilter = tokenContract.filters.Transfer(address, null);
      const receivedFilter = tokenContract.filters.Transfer(null, address);
      const claimFilter = tokenContract.filters.TokensClaimed(address);
      const mintFilter = tokenContract.filters.TokensMinted(address);

      const [sentEvents, receivedEvents, claimEvents, mintEvents] = await Promise.all([
        tokenContract.queryFilter(sentFilter, BLOCK_NUMBER),
        tokenContract.queryFilter(receivedFilter, BLOCK_NUMBER),
        tokenContract.queryFilter(claimFilter, BLOCK_NUMBER),
        tokenContract.queryFilter(mintFilter, BLOCK_NUMBER),
      ]);

      const allEvents = [
        ...claimEvents.map((e: any) => ({ e, type: 'claim' as const })),
        ...mintEvents.map((e: any) => ({ e, type: 'mint' as const })),
        ...sentEvents.map((e: any) => ({ e, type: 'transfer_out' as const })),
        ...receivedEvents.map((e: any) => ({ e, type: 'transfer_in' as const })),
      ];

      const claimAndMintHashes = new Set([
        ...claimEvents.map((e: any) => e.transactionHash),
        ...mintEvents.map((e: any) => e.transactionHash),
      ]);

      const deduped = allEvents.filter(({ e, type }) => {
        if (type === 'transfer_out' || type === 'transfer_in') {
          return !claimAndMintHashes.has(e.transactionHash);
        }
        return true;
      });
      const blockNumbers = [...new Set(deduped.map(({ e }) => e.blockNumber))];

      const blocks = await Promise.all(blockNumbers.map((blockNum) =>
          tokenContract.runner?.provider?.getBlock(blockNum)
        )
      );

      const blockMap = new Map(
        blockNumbers.map((num, i) => [num, blocks[i]?.timestamp ?? 0])
      );

      const allItems: ActivityItem[] = deduped.map(({ e, type }) => ({
        id: e.transactionHash + e.logIndex,
        type,
        amount: type === 'transfer_out' || type === 'transfer_in'
          ? e.args.value
          : e.args.amount,
        address: type === 'claim'
          ? e.args.claimant
          : type === 'mint'
          ? e.args.to
          : type === 'transfer_out'
          ? e.args.to
          : e.args.from,
        timestamp: blockMap.get(e.blockNumber) ?? 0,
        txHash: e.transactionHash,
      }));
      
      setItems(allItems.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenContract, address]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);
  console.log(items);
  

  return { items, isLoading, refetch: fetchActivity };
};

export interface UseCooldownReturn {
  canClaim: boolean;
  remainingSeconds: number;
  formattedCountdown: string;
}

export function useCooldown(lastClaimed: bigint, cooldownSeconds: bigint): UseCooldownReturn {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const compute = () => {
      const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
      const elapsed = nowSeconds - lastClaimed;
      const rem = Number(cooldownSeconds - elapsed);
      setRemaining(Math.max(0, rem));
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