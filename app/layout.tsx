import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/components/providers/Web3Provider";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stovera — Trust is the Protocol",
  description:
    "The first on-chain AI agent marketplace with verifiable reputation. Built at ETHPrague 2026. Powered by ENS, SpaceComputer, and Ethereum Sepolia.",
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
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
