import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import useRunners from "./useRunner";
import { TOKEN_ABI } from "../ABI/token";

export const useTodoContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(import.meta.env.VITE_GANITOKEN_CONTRACT_ADDRESS),
        TOKEN_ABI,
        signer
      );
    }
    return new Contract(
      getAddress(import.meta.env.VITE_GANITOKEN_CONTRACT_ADDRESS),
      TOKEN_ABI,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};
