'use client'
import Image from "next/image";
import { useState } from "react";
import Game from "./Game";
import { ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect } from "@thirdweb-dev/react";


export default function Home() {

  
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId="9c412cc2218b8c9a321a733d7709ae5f"
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
      ]}
    >
    <Game/>
    </ThirdwebProvider>
  );
}