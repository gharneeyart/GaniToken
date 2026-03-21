// ============================================================
// FORMATTERS — Pure utility functions, no contract deps
// ============================================================

/**
 * Format a bigint token amount to a human-readable string
 * @param amount  raw bigint (e.g. from contract)
 * @param decimals token decimals (default 18)
 * @param displayDecimals how many decimals to show (default 2)
 */
export function formatTokenAmount(
  amount: bigint,
  decimals = 18,
  displayDecimals = 2
): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  const fracStr = remainder.toString().padStart(decimals, '0').slice(0, displayDecimals);
  const wholeFormatted = whole.toLocaleString();
  if (displayDecimals === 0 || fracStr === '00') return wholeFormatted;
  return `${wholeFormatted}.${fracStr}`;
}

/**
 * Shorten an Ethereum address: 0x1234…abcd
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/**
 * Given a lastClaimed unix timestamp (seconds) and cooldown seconds,
 * returns { canClaim, remainingSeconds }
 */
export function getCooldownStatus(
  lastClaimedTimestamp: number,
  cooldownSeconds: number
): { canClaim: boolean; remainingSeconds: number } {
  if (lastClaimedTimestamp === 0) return { canClaim: true, remainingSeconds: 0 };
  const nowSeconds = Math.floor(Date.now() / 1000);
  const elapsed = nowSeconds - lastClaimedTimestamp;
  if (elapsed >= cooldownSeconds) return { canClaim: true, remainingSeconds: 0 };
  return { canClaim: false, remainingSeconds: cooldownSeconds - elapsed };
}

/**
 * Format remaining seconds into "Xh Ym Zs"
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0s';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Format a unix timestamp to a relative time string like "2 mins ago"
 */
export function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Calculate supply percentage for progress bar
 */
export function supplyPercent(totalSupply: bigint, maxSupply: bigint): number {
  if (maxSupply === 0n) return 0;
  return Number((totalSupply * 10000n) / maxSupply) / 100;
}

/**
 * Build block explorer URL for a tx hash
 */
export function explorerTxUrl(hash: string, baseUrl: string): string {
  return `${baseUrl}/tx/${hash}`;
}

/**
 * Validate an Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Clsx-lite: join classnames, filtering falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
