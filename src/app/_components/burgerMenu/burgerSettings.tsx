'use client';

import nextConfig from "@/next.config.mjs";
import Image from 'next/image';
import { useMemo, useState } from "react";

import CustomButton from "../customButton/component";

import './burgerMenu.css';
import './burgerSettings.css';

interface BurgerSettingsProps {
    children: JSX.Element;
}

export default function BurgerSettings({
    children,
}: BurgerSettingsProps) {
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
        <div className="burgerSettings">
            <span className="openArrow" onClick={toggleMenu} />
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
                            <h2>Settings</h2>
                            <CustomButton label="&#8594;" type="primary" onClickCallback={closeMenu} />
                        </div>
                        <span className="horizontalRuler" />
                        <div className="slideMenuContent">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
}
