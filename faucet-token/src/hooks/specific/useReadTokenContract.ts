import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenContract } from "../useContract";
import { useCallback, useEffect, useState } from "react";
import useRunners from "../useRunner";
import type { ActivityItem } from "../../types";

// --------------- useReadToken ---------------
export const useReadToken = () => {
  const tokenContract = useTokenContract();
  const { address } = useAppKitAccount();

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

// --------------- useActivity ---------------
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
        tokenContract.queryFilter(sentFilter, -10000),
        tokenContract.queryFilter(receivedFilter, -10000),
        tokenContract.queryFilter(claimFilter, -10000),
        tokenContract.queryFilter(mintFilter, -10000),
      ]);

      const allItems: ActivityItem[] = [
        ...claimEvents.map((e: any) => ({
          id: e.transactionHash + e.logIndex,
          type: 'claim' as const,
          amount: e.args.amount,
          address: e.args.claimant,
          timestamp: 0,
          txHash: e.transactionHash,
        })),
        ...mintEvents.map((e: any) => ({
          id: e.transactionHash + e.logIndex,
          type: 'mint' as const,
          amount: e.args.amount,
          address: e.args.to,
          timestamp: 0,
          txHash: e.transactionHash,
        })),
        ...sentEvents.map((e: any) => ({
          id: e.transactionHash + e.logIndex,
          type: 'transfer_out' as const,
          amount: e.args.value,
          address: e.args.to,
          timestamp: 0,
          txHash: e.transactionHash,
        })),
        ...receivedEvents.map((e: any) => ({
          id: e.transactionHash + e.logIndex,
          type: 'transfer_in' as const,
          amount: e.args.value,
          address: e.args.from,
          timestamp: 0,
          txHash: e.transactionHash,
        })),
      ];

      // Sort by most recent first
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

  return { items, isLoading, refetch: fetchActivity };
};