'use client';

import nextConfig from "@/next.config.mjs";
import Image from 'next/image';
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomButton from "../customButton/component";

import { BurgerMenuType } from "@/src/types/burgerMenuTypes";

import './burgerMenu.css';

interface BurgerMenuProps {
    menuType: BurgerMenuType;
}

export default function BurgerMenu({
    menuType,
}: BurgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
            return;
        }

        setIsOpen(true);
        setIsClosing(false);
    };

    const closeMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500); // /!\ Match CSS animation duration /!\
    };

    const menuAnimationClass = useMemo(() => {
        const result = [];

        if (isClosing) {
            result.push('closing');
            return result;
        }

        if (isOpen) {
            result.push('open');
        }

        return result;
    }, [isOpen, isClosing]);

    return <>
        <label className="phoneMenu" onClick={toggleMenu}>
            <span />
            <span />
            <span />
        </label>
        {(isOpen || isClosing) && (
            <div
                className={`slideMenuBackground ${menuAnimationClass.join(' ')}`}
                onClick={closeMenu}
            >
                <div
                    className={`slideMenu ${menuAnimationClass.join(' ')}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="slideMenuHeader">
                        <Image
                            className="logoImg"
                            src={`${nextConfig.basePath}/Logo.png`}
                            alt={'App logo'}
                            priority={true}
                            width={1} height={1}
                        />
                        <CustomButton label="&#8594;" type="primary" onClickCallback={closeMenu} />
                    </div>
                    <span className="horizontalRuler" />
                    <div className="slideMenuContent">
                        {menuTypeToContent(menuType, closeMenu)}
                    </div>
                </div>
            </div>
        )}
    </>
}

function menuTypeToContent(menuType: BurgerMenuType, closeMenu: () => void) {
    switch (menuType) {
        case BurgerMenuType.Navigation:
            return <LinksBurgerMenu closeMenu={closeMenu} />;
        case BurgerMenuType.Empty:
            return <></>;
    }
};

interface SubBurgerMenuProps {
    closeMenu: () => void;
}

function LinksBurgerMenu({
    closeMenu,
}: SubBurgerMenuProps) {
    const { i18n, t } = useTranslation();

    const pagesButtons = [
        <Link key="home" className="navLink" href={`/${i18n.language}`} onClick={closeMenu}>{t("common:home")}</Link>,
        <Link key="quiz" className="navLink" href={`/${i18n.language}/quiz`} onClick={closeMenu}>{t("common:quiz")}</Link>,
        <Link key="quiz2" className="navLink" href={`/${i18n.language}/quiz2`} onClick={closeMenu}>{t("common:quiz2")}</Link>,
        <Link key="settings" className="navLink" href={`/${i18n.language}/settings`} onClick={closeMenu}>{t("common:settings")}</Link>,
    ];

    return <>
        {...pagesButtons}
    </>
}
