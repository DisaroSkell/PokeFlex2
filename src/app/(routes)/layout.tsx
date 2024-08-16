import nextConfig from "@/next.config.mjs"
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

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
  params: {locale: string};
}>) {
  return (
    <html lang="en" data-lt-installed="true">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
