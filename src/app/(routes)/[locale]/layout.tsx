import Header from "../../_components/header/component";
import Footer from "../../_components/footer/component";
import StoreProvider from "../../_components/providers/storeProvider";

import "../globals.css";
import { HTMLLangHandler } from "../../_components/htmlLangHandler/component";

export default function DefaultLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  return (
    <>
      <HTMLLangHandler locale={params.locale} />
      <div className="header">
        <Header locale={params.locale} />
      </div>
      <div className="mainContent">
        <StoreProvider>{children}</StoreProvider>
      </div>
      <div className="footer">
        <Footer locale={params.locale} />
      </div>
    </>
  );
}
