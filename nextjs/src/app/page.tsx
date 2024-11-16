"use client";
import Image from "next/image";
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

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const { initExportProcess } = useEmbeddedReveal();

  return isLoggedIn ? (
    <div className="w-full">
      {/* Header */}
      <div>
        <p>Balance</p>
        <h1>0.00</h1>
      </div>

      {/* History */}
      <div></div>

      {/* CTAs */}
      <div className="fixed inset-x-0 bottom-0 flex w-full gap-2 p-2">
        {/* Pay modal */}
        <PayDrawer />

        {/* Receive modal */}
        <ReceiveDrawer />
      </div>
    </div>
  ) : (
    <DynamicWidget />
  );
}
