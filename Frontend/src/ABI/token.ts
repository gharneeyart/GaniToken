export const TOKEN_ABI = [
  // constructor
  "constructor(uint256 initialSupply)",

  // write functions
  "function requestToken()",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transferOwnership(address newOwner)",
  "function renounceOwnership()",

  // read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function owner() view returns (address)",
  "function lastClaimed(address) view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function CLAIM_AMOUNT() view returns (uint256)",
  "function COOLDOWN() view returns (uint256)",

  // events
  "event TokensClaimed(address indexed claimant, uint256 amount, uint256 nextClaimAt)",
  "event TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",

  // custom errors
  "error CooldownNotElapsed(uint256 retryAt)",
  "error ExceedsMaxSupply(uint256 requested, uint256 available)",
  "error InvalidRecipient()",
  "error ZeroAmount()",
  "error OwnableUnauthorizedAccount(address account)",
  "error OwnableInvalidOwner(address owner)",
] as const;