"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

interface HTMLLangHandlerProps {
    locale: string
}

export const HTMLLangHandler = ({
    locale
}: HTMLLangHandlerProps) => {
  const { lang } = useParams();
  
  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);
  
  return null;
}
