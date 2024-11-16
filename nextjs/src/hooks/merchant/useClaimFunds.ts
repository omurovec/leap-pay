import { useState } from "react";
import { Address, WalletClient, createWalletClient, http } from "viem";
import { NetworkType, NETWORK_CONFIG } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletABI from "@/abis/CustomSmartWallet.json";

interface UseClaimFundsProps {
  smartWalletAddress: Address;
  network: NetworkType;
  wallet: WalletClient | `0x${string}`; // Can accept wallet client or private key
}

interface ClaimFundsResult {
  claimFunds: (signature: string, amount: bigint) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useClaimFunds({
  network,
  wallet,
  smartWalletAddress,
}: UseClaimFundsProps): ClaimFundsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claimFunds = async (signature: string, amount: bigint) => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient(network);

      // Create wallet client if private key provided
      const walletClient =
        typeof wallet === "string"
          ? createWalletClient({
              account: wallet,
              chain: client.chain,
              transport: http(NETWORK_CONFIG[network].rpcUrl),
            })
          : wallet;

      const { request } = await client.simulateContract({
        address: smartWalletAddress,
        abi: CustomSmartWalletABI,
        functionName: "claimFunds",
        args: [signature, amount],
        account: walletClient.account,
      });

      // Execute the transaction
      await walletClient.writeContract(request);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to claim funds");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimFunds,
    isLoading,
    error,
  };
}
