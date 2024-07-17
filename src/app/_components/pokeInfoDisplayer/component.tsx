import nextConfig from "@/next.config.mjs";
import Image from 'next/image';

import { PokeInfoOptions, Pokemon, shinyChance } from "@/src/types/pokemon.type"

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
    function getLoadingImage(width: number, height: number) {
        return <Image
            className={'banana'}
            src={`${nextConfig.basePath}/Logo.png`}
            alt={'loading'}
            priority={true}
            width={width} height={height}
        />
    }

    function getIDElem (id: number | null) {
        if (!id) {
            return getLoadingImage(size, size);
        }

        return <p>
            {id}
        </p>
    }

    function getImageElem (poke: Pokemon | null, width: number, height: number) {
        if (!poke) {
            return getLoadingImage(size, size);
        }

        // Don't ask why 4
        const isShiny = Math.floor(Math.random() * shinyChance) === 4;
        const image = isShiny && poke.shinyImgUrl ? poke.shinyImgUrl : poke.imgUrl

        return <>
        <Image
            src={image}
            alt={poke.name}
            priority={true}
            width={width} height={height}
        />
        {
            isShiny
            ? poke.shinyImgUrl
                ? <p>✦ It&apos;s shiny ! ✦</p>
                : <p>Pretend it is shiny</p>
            : <></>
        }
        </>
    }

    function getNameElem (name: string | null) {
        if (!name) {
            return getLoadingImage(size, size);
        }

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