'use client';

import { useState } from "react";

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
                {menuContent}
            </div>
        </div>
    </>
}
