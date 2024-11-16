"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/Input";
import ReceiveDrawer from "@/components/ui/receive-drawer";
import PayDrawer from "@/components/ui/pay-drawer";
import {
  useIsLoggedIn,
  DynamicContextProvider,
  DynamicWidget,
  useEmbeddedReveal,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { formatUsdc } from "@/utils/formatUsdc";
import { AnimatedNumber } from "@/components/ui/home/animated-number";
import { useWalletAddress } from "@/hooks/dynamic/useWalletAddress";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { DEFAULT_NETWORK } from "@/config/networks";
import { useSmartWalletAddress } from "@/hooks/useSmartWalletAddress";

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const eoaAddress = useWalletAddress();
  const {
    smartWalletAddress,
    isLoading: isSmartWalletAddressLoading,
    error: smartWalletAddressError,
  } = useSmartWalletAddress({
    eoaAddress: eoaAddress as `0x${string}`,
    network: DEFAULT_NETWORK,
  });
  const {
    balance: walletBalance,
    isLoading: isWalletBalanceLoading,
    error: walletBalanceError,
  } = useWalletBalance({
    walletAddress: smartWalletAddress as `0x${string}`,
    network: DEFAULT_NETWORK,
  });

  const usdcBalance = formatUsdc(BigInt(walletBalance));

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smartWalletAddress || "");
  };

  return isLoggedIn ? (
    <div className="w-full">
      {/* Header */}
      <div className="flex mx-auto flex-col items-center mt-36">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <div className="flex flex-col w-fit mx-auto">
            <span className="text-muted-foreground text-sm text-left uppercase text-slate-500 font-semibold self-start">
              Balance
            </span>
            <h1 className="text-6xl font-bold text-left tracking-tighter">
              $<AnimatedNumber value={usdcBalance.whole} />.
              <span className="text-slate-300">
                <AnimatedNumber value={usdcBalance.decimal} />
              </span>
            </h1>
            <p
              className="mt-4 text-muted-foreground font-semibold text-slate-500"
              onClick={copyToClipboard}
            >
              {smartWalletAddress
                ? smartWalletAddress?.slice(0, 6) +
                  "..." +
                  smartWalletAddress?.slice(-4)
                : "No Smart Wallet"}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex w-full gap-2 p-2 mt-12">
        {/* Pay modal */}
        <PayDrawer />

        {/* Receive modal */}
        <ReceiveDrawer />
      </div>

      {/* History */}
      <div></div>
    </div>
  ) : (
    <DynamicWidget />
  );
}
