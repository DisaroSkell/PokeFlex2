import nextConfig from "@/next.config.mjs";
import Image from 'next/image';

import { PokeInfoOptions, Pokemon, PokePos, shinyChance } from "@/src/types/pokemon.type"

import { formatNumberToMinNdigits } from "@/src/utils/utils";

import "./pokeInfoDisplayer.css"

interface PokeInfoDisplayerProps {
    pokemon: Pokemon | null
    infoType: PokeInfoOptions
    pokePos: PokePos
}

export default function PokeInfoDisplayer({
    pokemon,
    infoType,
    pokePos
}: PokeInfoDisplayerProps) {
    function getLoadingImage() {
        return <Image
            className={'imageAutoFit pokemonImg banana'}
            src={`${nextConfig.basePath}/Logo.png`}
            alt={'loading'}
            priority={true}
            width={1} height={1}
        />
    }

    function getIDElem (id: number) {
        return <p>
            {formatNumberToMinNdigits(id, 3)}
        </p>
    }

    function getImageElem (poke: Pokemon) {
        const isShiny = Math.random() < shinyChance;
        const image = isShiny && poke.shinyImgUrl ? poke.shinyImgUrl : poke.imgUrl;

        return <>
        <Image
            className={'imageAutoFit pokemonImg'}
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

    function getNameElem (name: string) {
        return <p>
            {name}
        </p>
    }

    const elementToDisplay = () => {
        if (!pokemon) {
            return getLoadingImage();
        }

        const elementsArray: JSX.Element[] = [];

        if (pokePos === PokePos.prev) {
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'imageAutoFit questionMark'}
                src={`${nextConfig.basePath}/question_mark.webp`}
                alt={'Question mark symbol'}
                priority={true}
                width={1} height={1}
            />);
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'imageAutoFit arrow transformFlip'}
                src={`${nextConfig.basePath}/arrow.png`}
                alt={'Left arrow symbol'}
                priority={true}
                width={1} height={1}
            />);
        }

        let infoElem = <></>

        switch (infoType) {
            case PokeInfoOptions.ID:
                infoElem = getIDElem(pokemon.id);
                break;
            case PokeInfoOptions.Image:
                infoElem = getImageElem(pokemon);
            break;
            case PokeInfoOptions.Name:
                infoElem = getNameElem(pokemon.name);
            break;
        }

        elementsArray.push(<div
            className="pokemonContainer"
            key={elementsArray.length}
        >
            {infoElem}
        </div>);

        if (pokePos === PokePos.next) {
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'imageAutoFit arrow'}
                src={`${nextConfig.basePath}/arrow.png`}
                alt={'Right arrow symbol'}
                priority={true}
                width={1} height={1}
            />);
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'imageAutoFit questionMark'}
                src={`${nextConfig.basePath}/question_mark.webp`}
                alt={'Question mark symbol'}
                priority={true}
                width={1} height={1}
            />);
        }

        return elementsArray;
    }

    return <div className="infoDisplayer">
        {elementToDisplay()}
    </div>
}