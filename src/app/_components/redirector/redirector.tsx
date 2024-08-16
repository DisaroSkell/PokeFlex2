'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getClientSideCookie } from "@/src/utils/cookies";
import { i18nDefaultLanguage } from "@/i18nConfig";

interface RedirectorProps {
    path: string
    disabled?: boolean
}

export default function Redirector({
    path,
    disabled,
}: RedirectorProps) {
    const router = useRouter();

    useEffect(() => {
        if (!disabled) {
            const locale = getClientSideCookie("NEXT_LOCALE");

            if (locale) router.replace(`/${locale}${path}`);
            else router.replace(`/${i18nDefaultLanguage}${path}`);
        }
    }, [path, disabled, router]);

    return <></>;
}
