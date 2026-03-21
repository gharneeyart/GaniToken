import { ethers, network, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance  :", ethers.formatEther(balance), "ETH\n");

  const initialOwner = deployer.address;
  const initialSupply = ethers.parseUnits("500000", 18);

  console.log("Constructor args:");
  console.log("  initialOwner  :", initialOwner);
  console.log("  initialSupply :", ethers.formatUnits(initialSupply, 18), "GSK\n");

  console.log("Deploying FaucetToken...");
  const GaniToken = await ethers.getContractFactory("GaniToken");
  const token = await GaniToken.deploy(initialSupply);

  console.log("Waiting for deployment transaction...");
  await token.waitForDeployment();

  const contractAddress = await token.getAddress();
  const deployTx = token.deploymentTransaction();

  console.log("\n FaucetToken deployed!");
  console.log("   Contract address :", contractAddress);
  console.log("   Tx hash          :", deployTx?.hash ?? "n/a");

  console.log("\nVerifying deployment values...");
  const name = await token.name();
  const symbol = await token.symbol();
  const maxSupply = await token.MAX_SUPPLY();
  const totalSupply = await token.totalSupply();
  const owner = await token.owner();
  const claimAmount = await token.CLAIM_AMOUNT();
  const cooldown = await token.COOLDOWN();

  console.log("   name         :", name);
  console.log("   symbol       :", symbol);
  console.log("   owner        :", owner);
  console.log("   MAX_SUPPLY   :", ethers.formatUnits(maxSupply, 18), "GSK");
  console.log("   totalSupply  :", ethers.formatUnits(totalSupply, 18), "GSK");
  console.log("   CLAIM_AMOUNT :", ethers.formatUnits(claimAmount, 18), "GSK");
  console.log("   COOLDOWN     :", (Number(cooldown) / 3600).toString(), "hours");

  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting 6 block confirmations before Etherscan verification...");
    await deployTx?.wait(6);

    console.log("Submitting verification to Etherscan...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [initialOwner, initialSupply],
      });
      console.log("Contract verified on Etherscan!");
      console.log(
        `   https://sepolia.etherscan.io/address/${contractAddress}#code`
      );
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("Already Verified")
      ) {
        console.log("Contract already verified.");
      } else {
        console.error("Verification failed:", err);
        console.log("    Run manually:");
        console.log(
          `    npx hardhat verify --network epolia ${contractAddress} "${initialOwner}" "${initialSupply}"`
        );
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
