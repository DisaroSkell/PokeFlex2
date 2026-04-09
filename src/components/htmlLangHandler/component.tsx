import { useEffect } from "react";

interface HTMLLangHandlerProps {
    locale: string
}

export default function HTMLLangHandler({
    locale
}: HTMLLangHandlerProps) {
    useEffect(() => {
        document.documentElement.setAttribute("lang", locale);
    }, [locale]);
    
    return null;
}
