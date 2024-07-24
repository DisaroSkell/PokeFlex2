import nextConfig from "@/next.config.mjs";
import Image from 'next/image';

import { PokeInfoOptions, Pokemon, shinyChance } from "@/src/types/pokemon.type"

import "./pokeInfoDisplayer.css"

interface PokeInfoDisplayerProps {
    pokemon: Pokemon | null
    infoType: PokeInfoOptions
}

export default function PokeInfoDisplayer({
    pokemon,
    infoType
}: PokeInfoDisplayerProps) {
    function getLoadingImage() {
        return <Image
            className={'banana'}
            src={`${nextConfig.basePath}/Logo.png`}
            alt={'loading'}
            priority={true}
            width={1} height={1}
        />
    }

    function getIDElem (id: number | null) {
        if (!id) {
            return getLoadingImage();
        }

        return <p>
            {id}
        </p>
    }

    function getImageElem (poke: Pokemon | null) {
        if (!poke) {
            return getLoadingImage();
        }

        const isShiny = Math.random() < shinyChance;
        const image = isShiny && poke.shinyImgUrl ? poke.shinyImgUrl : poke.imgUrl

        return <>
        <Image
            src={image}
            alt={poke.name}
            priority={true}
            width={1} height={1}
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
            return getLoadingImage();
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
                elem = getImageElem(pokemon);
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