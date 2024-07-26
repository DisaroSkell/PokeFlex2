import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "../_components/header/component";
import StoreProvider from "./storeProvider";

import "./globals.css";

import nextConfig from "@/next.config.mjs"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéFlex 2",
  description: "Ultimate Pokémon quiz",
  icons: {
    icon: `${nextConfig.basePath}/icon.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-lt-installed="true">
      <body className={inter.className}>
        <div className="header">
          <Header />
        </div>
        <div className="mainContent">
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  );
}
