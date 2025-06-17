'use client';

import nextConfig from "@/next.config.mjs";
import Image from 'next/image';
import { useState } from "react";

import CustomButton from "../customButton/component";

import './burgerMenu.css';

interface BurgerMenuProps {
    menuContent: JSX.Element;
}

export default function BurgerMenu({
    menuContent,
}: BurgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <label className="phoneMenu" onClick={() => setIsOpen(!isOpen)}>
            <span />
            <span />
            <span />
        </label>
        <div className={"slideMenu" + (isOpen ? " open" : "")} onClick={() => setIsOpen(false)}>
            <div className="slideMenuContent" onClick={(e) => e.stopPropagation()}>
                <div className="slideMenuHeader">
                    <Image
                        className="logoImg"
                        src={`${nextConfig.basePath}/Logo.png`}
                        alt={'App logo'}
                        priority={true}
                        width={1} height={1}
                    />
                    <CustomButton label="&#8594;" type="primary" onClickCallback={() => setIsOpen(false)} />
                </div>
                <span className="horizontalRuler" />
                {menuContent}
            </div>
        </div>
    </>
}
