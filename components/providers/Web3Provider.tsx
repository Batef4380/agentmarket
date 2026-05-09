"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

function buildConfig() {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";
  const validProjectId = projectId && projectId !== "your_project_id_here" ? projectId : "";

  return createConfig({
    chains: [base],
    connectors: [
      metaMask(),
      coinbaseWallet({ appName: "Stovera" }),
      ...(validProjectId ? [walletConnect({ projectId: validProjectId })] : []),
    ],
    transports: {
      [base.id]: http(),
    },
  });
}

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config] = useState(() => buildConfig());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
