# GaniToken (GSK) — ERC20 DApp

A full-stack decentralized application built on **Lisk Sepolia** testnet. Includes a custom ERC20 token contract with a public faucet and owner-only minting, paired with a React frontend.

---

## Live Demo

> [test](https://gani-token.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)

---

## Overview

GaniToken (GSK) is a standard ERC20 token with two custom functions:

- **`requestToken()`** — any wallet can claim 100 GSK once every 24 hours
- **`mint()`** — only the contract owner can mint tokens up to the MAX_SUPPLY cap

The frontend provides a clean dashboard to interact with all contract functions — claim tokens, transfer, mint (owner only), and view live token stats.

---

## Smart Contract

**Network:** Lisk Sepolia Testnet  
**Contract Address:** `0x9677088abbb3F467eFF17A3D8841212d7F4CB303` 
**Token Name:** GaniToken  
**Symbol:** GSK  
**Decimals:** 18  

### Constants

| Constant | Value |
|---|---|
| `MAX_SUPPLY` | 10,000,000 GSK |
| `CLAIM_AMOUNT` | 100 GSK |
| `COOLDOWN_PERIOD` | 86,400 seconds (24 hours) |

### Functions

**Write**

| Function | Access | Description |
|---|---|---|
| `requestToken()` | Anyone | Claim 100 GSK once per 24 hours |
| `mint(address, uint256)` | Owner only | Mint tokens up to MAX_SUPPLY |
| `transfer(address, uint256)` | Token holder | Send tokens to another address |
| `approve(address, uint256)` | Token holder | Approve spender allowance |
| `transferFrom(address, address, uint256)` | Approved spender | Transfer on behalf of owner |
| `transferOwnership(address)` | Owner only | Transfer contract ownership |

**Read**

| Function | Returns | Description |
|---|---|---|
| `name()` | string | Token name |
| `symbol()` | string | Token symbol |
| `decimals()` | uint8 | Token decimals |
| `totalSupply()` | uint256 | Current total supply |
| `MAX_SUPPLY()` | uint256 | Maximum supply cap |
| `CLAIM_AMOUNT()` | uint256 | Amount per faucet claim |
| `COOLDOWN()` | uint256 | Cooldown period in seconds |
| `balanceOf(address)` | uint256 | Token balance of an address |
| `owner()` | address | Contract owner address |
| `lastClaimed(address)` | uint256 | Last claim timestamp per wallet |
| `allowance(address, address)` | uint256 | Remaining spender allowance |

### Custom Errors

| Error | Description |
|---|---|
| `CooldownNotElapsed(uint256 retryAt)` | Claim attempted before cooldown ends |
| `ExceedsMaxSupply(uint256 requested, uint256 available)` | Mint would exceed MAX_SUPPLY |
| `InvalidRecipient()` | Mint to zero address attempted |
| `ZeroAmount()` | Zero amount passed to mint |

---

## Frontend

### Features

- Connect wallet via **Reown AppKit** (supports MetaMask, WalletConnect, and more)
- Live token stats — balance, total supply, max supply, claim amount
- **Faucet panel** — claim 100 GSK with per-wallet countdown timer
- **Transfer panel** — send GSK to any address with balance validation
- **Mint panel** — visible only to the contract owner
- **Token info panel** — full contract details with copy and block explorer links
- **Activity feed** — recent claims, mints, and transfers filtered by type
- Wrong network detection with visual warning
- Fully responsive on all screen sizes
- Auto-updates after every transaction — no manual refresh needed

---

## Project Structure

```
├── faucet-contract/               # Hardhat smart contract project
│   ├── contracts/
│   │   └── GaniToken.sol          # Main ERC20 contract
│   ├── test/
│   │   └── GaniToken.ts      # Full test suite (30+ tests)
│   ├── scripts/
│   │   └── deploy.ts              # Deploy + auto-verify script
│   ├── ignition/
│   │   └── modules/
│   │       └── GaniToken.ts # Hardhat Ignition module
│   ├── hardhat.config.ts
│   └── .env.example
│
└── faucet-token/                  # React frontend
    ├── src/
    │   ├── ABI/
    │   │   └── token.ts           # Contract ABI
    │   ├── components/
    │   │   ├── ui/                # Reusable UI primitives
    │   │   ├── panels/            # Feature panels
    │   │   ├── Navbar.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── StatsRow.tsx
    │   │   └── ConnectPrompt.tsx
    │   ├── contexts/
    │   │   └── TokenContext.tsx   # Shared token state
    │   ├── hooks/
    │   │   ├── useContract.ts     # Contract instance
    │   │   ├── useRunner.ts       # Provider + signer
    │   │   └── specific/
    |   |       ├── useWriteTokenContract.ts 
    │   │       └── useReadTokenContract.ts  # All read + write hooks
    │   ├── constants/
    │   │   ├── index.ts           # Chain config, contract address
    │   │   └── provider.ts        # Read-only JSON RPC provider
    │   ├── lib/
    │   │   └── utils.ts           # Formatters and helpers
    │   ├── types/
    │   │   └── index.ts           # TypeScript interfaces
    │   ├── connection.ts          # Reown AppKit initialization
    │   ├── App.tsx
    │   └── main.tsx
    └── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A wallet with Lisk Sepolia ETH (get from the [Lisk faucet](https://faucet.lisk.com))

### Smart Contract

```bash
cd Blockchain
npm install
cp .env.example .env
# Fill in your PRIVATE_KEY, LISK_SEPOLIA_RPC_URL, BLOCKSCOUT_API_KEY
```

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

---

## Environment Variables

### Smart Contract (`Blockchain/.env`)

```env
PRIVATE_KEY=your_wallet_private_key
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com
BLOCKSCOUT_API_KEY=your_blockscout_api_key
```

### Frontend (`Frontend/.env`)

```env
VITE_REOWN_PROJECT_ID=your_reown_project_id
VITE_GANITOKEN_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_LISK_TESTNET_RPC_URL=https://rpc.sepolia-api.lisk.com
```

> Get your Reown Project ID at [dashboard.reown.com](https://dashboard.reown.com)

---

## Running Tests

```bash
cd Blockchain
npx hardhat test
```

### Test Coverage

- Deployment with valid and invalid initial supply
- `requestToken` — first claim, cooldown enforcement, post-cooldown re-claim, supply cap, independent per-wallet cooldowns
- `mint` — owner access, non-owner revert, zero address, zero amount, exceeds cap, exact cap
- View helpers — `cooldownRemaining`, `canClaim`
- Standard ERC20 — `transfer`, `approve`, `transferFrom`
- Ownership transfer and renounce

---

## Deployment

### Deploy to Lisk Sepolia

```bash
cd Blockchain

# Using Hardhat scripts
npx hardhat run scripts/deploy.ts --network liskSepolia

# Using Hardhat Ignition
npx hardhat ignition deploy ignition/modules/GaniTokenModule.ts --network liskSepolia
```

The deploy script automatically:
1. Deploys the contract
2. Prints the contract address
3. Verifies source code on Blockscout

After deployment copy the contract address into `Blockchain/.env`:

```env
VITE_GANITOKEN_CONTRACT_ADDRESS=0xYourNewAddress
```

### Deploy Frontend

```bash
cd Frontend
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## Tech Stack

### Smart Contract
- [Solidity 0.8.30](https://soliditylang.org)
- [Hardhat](https://hardhat.org)
- [OpenZeppelin Contracts v5](https://openzeppelin.com/contracts)
- [Hardhat Ignition](https://hardhat.org/ignition)

### Frontend
- [React 18](https://react.dev) + [TypeScript](https://typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Reown AppKit](https://reown.com/appkit) — wallet connection
- [ethers.js v6](https://docs.ethers.org/v6)
- [react-hot-toast](https://react-hot-toast.com)
- [lucide-react](https://lucide.dev)

---

## License

MIT