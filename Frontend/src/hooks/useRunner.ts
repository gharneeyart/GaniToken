import { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from "ethers";
import { SUPPORTED_CHAIN_ID } from "../constants";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";


const useRunners = () => {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
  );

  useEffect(() => {
    if (!provider) return;
    provider.getSigner().then((newSigner) => {
      if (!signer) return setSigner(newSigner);
      if (newSigner.address === signer.address) return;
      setSigner(newSigner);
    });
  }, [provider, signer]);
  return { 
    address, 
    isConnected, 
    provider, 
    signer, 
    readOnlyProvider: jsonRpcProvider, 
    isConnecting: status === "connecting" || status === "reconnecting",
    isWrongNetwork: isConnected && chainId !== SUPPORTED_CHAIN_ID, 
    connect: () => open(),
    disconnect: () => open({ view: "Account" })};
};

export default useRunners;
