import nextConfig from "@/next.config.mjs";
import Link from "next/link";
import Image from 'next/image';

import "./header.css"

interface HeaderProps {
}

export default function Header({
}: HeaderProps) {
    return <div className="pokeHeader">
        <Link href="/">
            <Image
                className="logoImg"
                src={`${nextConfig.basePath}/Logo.png`}
                alt={'App logo'}
                priority={true}
                width={1} height={1}
            />
        </Link>
    </div>
}