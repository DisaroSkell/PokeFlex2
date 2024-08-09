import nextConfig from "@/next.config.mjs"
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "../../_components/header/component";
import Footer from "../../_components/footer/component";
import StoreProvider from "../../_components/providers/storeProvider";

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  return (
    <html lang="en" data-lt-installed="true">
      <body className={inter.className}>
        <div className="header">
          <Header locale={params.locale} />
        </div>
        <div className="mainContent">
          <StoreProvider>{children}</StoreProvider>
        </div>
        <div className="footer">
          <Footer locale={params.locale} />
        </div>
      </body>
    </html>
  );
}
