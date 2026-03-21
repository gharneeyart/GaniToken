# FaucetToken DApp UI

A React + TypeScript + Tailwind CSS frontend for the FaucetToken ERC20 contract.

## Stack
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **react-hot-toast** for notifications
- **lucide-react** for icons

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable primitives (Button, Card, Input, etc.)
│   ├── panels/          # Feature panels (Faucet, Mint, Transfer, etc.)
│   ├── Navbar.tsx
│   ├── Dashboard.tsx
│   ├── StatsRow.tsx
│   └── ConnectPrompt.tsx
├── hooks/
│   └── index.ts         # All contract hooks — REPLACE with wagmi hooks
├── lib/
│   └── utils.ts         # Pure utility functions (formatters, validators)
├── types/
│   └── index.ts         # TypeScript interfaces
├── constants/
│   └── index.ts         # Contract address, chain config
└── index.css
```

## Integrating the Smart Contract

All mock hooks are in `src/hooks/index.ts`. Each hook has a `⚡ REPLACE` comment.

### 1. Install wagmi + viem

```bash
npm install wagmi viem @tanstack/react-query
```

### 2. Set your contract address

`src/constants/index.ts`:
```ts
export const CONTRACT_ADDRESS = '0xYourDeployedAddress';
```

### 3. Add your ABI

Create `src/lib/abi.ts` with your compiled ABI from:
`artifacts/contracts/FaucetToken.sol/FaucetToken.json`

### 4. Replace hooks in `src/hooks/index.ts`

Each hook has the same return shape — only the internals change.

**Example — useTokenInfo:**
```ts
export function useTokenInfo(): UseTokenInfoReturn {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...contract, functionName: 'name' },
      { ...contract, functionName: 'symbol' },
      { ...contract, functionName: 'decimals' },
      { ...contract, functionName: 'totalSupply' },
      { ...contract, functionName: 'MAX_SUPPLY' },
      { ...contract, functionName: 'owner' },
    ],
  });
  // map data to TokenInfo shape...
}
```

**Example — useRequestToken:**
```ts
export function useRequestToken(onSuccess?: () => void): UseRequestTokenReturn {
  const { writeContractAsync, isPending, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  
  useEffect(() => { if (isSuccess) onSuccess?.(); }, [isSuccess]);

  const requestToken = () => writeContractAsync({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'requestToken',
  });

  return { requestToken, status: { hash, status: isPending ? 'pending' : 'idle' }, reset: () => {} };
}
```

**useCooldown** — no changes needed. It uses `lastClaimed` from `useUserState` and computes countdown client-side.

### 5. Wrap App with providers

`src/main.tsx`:
```tsx
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// wrap <App /> with your providers
```

### 6. Replace wallet actions in useWallet

```ts
const { address, isConnected } = useAccount();
const { connect } = useConnect();
const { disconnect } = useDisconnect();
const { chain } = useNetwork();
```

## Read Functions Integrated
1. `name()` — token name
2. `symbol()` — token symbol  
3. `decimals()` — token decimals
4. `totalSupply()` — current total supply
5. `MAX_SUPPLY()` — maximum supply cap
6. `owner()` — contract owner address
7. `balanceOf(address)` — user token balance
8. `lastClaimed(address)` — last claim timestamp (used for countdown)

## Write Functions Integrated
1. `requestToken()` — claim 100 GSK (24h cooldown)
2. `mint(address, uint256)` — owner only, mint up to MAX_SUPPLY
3. `transfer(address, uint256)` — standard ERC20 transfer
