// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition
import { parseUnits } from "ethers";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GaniTokenModule = buildModule("GaniTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", parseUnits("500000", 18));

  const ganiToken = m.contract("GaniToken", [initialSupply]);

  return { ganiToken };
});

export default GaniTokenModule;
