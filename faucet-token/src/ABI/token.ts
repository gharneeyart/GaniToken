export const TOKEN_ABI = [
// constructor
"constructor(uint256 initialSupply)",

// write function
"requestToken()",
"mint(address to, uint256 amount)",
"transfer(address to, uint256 value)",
"transferFrom(address from, address to, uint256 value)",
"approve(address spender, uint256 value)",
"transferOwnership(address newOwner)",
"renounceOwnership()",

// read function
"name()",
"symbol()",
"decimals()",
"totalSupply()",
"balanceOf(address account)",
"allowance(address owner, address spender)",
"owner()",
"lastClaimed(address)",
"MAX_SUPPLY()",
"CLAIM_AMOUNT()",
"COOLDOWN()",

// events
"TokensClaimed(address indexed claimant, uint256 amount, uint256 nextClaimAt)",
"TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply)",
"Transfer(address indexed from, address indexed to, uint256 value)",
"Approval(address indexed owner, address indexed spender, uint256 value)",
"OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",

// custom errors
"CooldownNotElapsed(uint256 retryAt)",
"ExceedsMaxSupply(uint256 requested, uint256 available)",
"InvalidRecipient()",
"ZeroAmount()",
"OwnableUnauthorizedAccount(address account)",
"OwnableInvalidOwner(address owner)"

] as const;