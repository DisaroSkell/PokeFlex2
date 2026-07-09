import { Outlet, useParams } from "react-router";
import { Suspense } from "react";
import { i18nDefaultLanguage } from "@/i18n";

import Footer from "@/components/footer/component";
import Header from "@/components/header/component";
import HTMLLangHandler from "@/components/htmlLangHandler/component";
import StoreProvider from "@/components/providers/storeProvider";
import TranslationsProvider from "@/components/providers/translationsProvider";
import TutorialModal from "@/components/tutorialModal/component";

const layoutNamespaces = ["common"];

export default function AppLayout() {
    const params = useParams<{ locale: string }>();
    const locale = params.locale ?? i18nDefaultLanguage;
    
    return (
        <StoreProvider>
            <TranslationsProvider locale={locale} namespaces={layoutNamespaces}>
                <Suspense fallback={null}>
                    <HTMLLangHandler locale={locale} />
                    
                    <div className="header">
                        <Header />
                    </div>
                    
                    <TutorialModal />
                    
                    <div className="mainContent">
                        <Outlet />
                    </div>
                    
                    <div className="footer">
                        <Footer />
                    </div>
                </Suspense>
            </TranslationsProvider>
        </StoreProvider>
    );
}
