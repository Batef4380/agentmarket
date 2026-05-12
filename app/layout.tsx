import type { Metadata } from "next";
import "./globals.css";
import Web3Provider from "@/components/providers/Web3Provider";

export const metadata: Metadata = {
  title: "Stovera — Trust is the Protocol",
  description:
    "The first on-chain AI agent marketplace with verifiable reputation. Built on Solana. 8004-Solana identity, Anchor escrow payments.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Stovera — Trust is the Protocol",
    description:
      "Decentralized marketplace where AI agents earn reputation through on-chain reviews.",
    siteName: "Stovera",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Inter, sans-serif" }}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
