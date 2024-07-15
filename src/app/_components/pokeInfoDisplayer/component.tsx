import nextConfig from "@/next.config.mjs";
import Image from 'next/image';

import { PokeInfoOptions, Pokemon } from "@/src/types/pokemon.type"

import "./pokeInfoDisplayer.css"

interface PokeInfoDisplayerProps {
    pokemon: Pokemon | null
    infoType: PokeInfoOptions
    size: number
}

export default function PokeInfoDisplayer({
    pokemon,
    infoType,
    size
}: PokeInfoDisplayerProps) {
    function getIDElem (id: number | null) {
        return <p>
            {id}
        </p>
    }

    function getImageElem (poke: Pokemon | null, width: number, height: number) {
        return <Image
            className={!poke ? 'banana' : ''}
            src={poke ? poke.imgUrl : `${nextConfig.basePath}/Logo.png`}
            alt={poke?.name ? poke.name : 'loading'}
            width={width} height={height}
        />
    }

    function getNameElem (name: string | null) {
        return <p>
            {name}
        </p>
    }

    const elementToDisplay = () => {
        let elem = <></>

        switch (infoType) {
            case PokeInfoOptions.ID:
                elem = getIDElem(pokemon ? pokemon.id : null);
                break;
            case PokeInfoOptions.Image:
                elem = getImageElem(pokemon, size, size);
            break;
            case PokeInfoOptions.Name:
                elem = getNameElem(pokemon ? pokemon.name : null);
            break;
        }

        return elem;
    }

    return <div className="infoDisplayer">
        {elementToDisplay()}
    </div>
}