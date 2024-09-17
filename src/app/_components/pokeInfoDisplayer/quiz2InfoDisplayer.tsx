import nextConfig from "@/next.config.mjs";
import Image from 'next/image';

import { Pokemon, PokePos, shinyChance } from "@/src/types/pokemon.type";

import "./quiz2InfoDisplayer.css";

interface Quiz2InfoDisplayerProps {
    pokemon: Pokemon | null
    pokePos: PokePos
}

export default function Quiz2InfoDisplayer({
    pokemon,
    pokePos
}: Quiz2InfoDisplayerProps) {
    function getLoadingImage() {
        return <Image
            className={'symbol pokemonImg banana'}
            src={`${nextConfig.basePath}/Logo.png`}
            alt={'loading'}
            priority={true}
            width={1} height={1}
        />;
    }

    function getImageElem (poke: Pokemon) {
        const isShiny = Math.random() < shinyChance;
        const image = isShiny && poke.shinyImgUrl ? poke.shinyImgUrl : poke.imgUrl;

        return <>
            <Image
                className={'symbol pokemonImg'}
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
        </>;
    }

    const elementsToDisplay = () => {
        if (!pokemon) {
            return getLoadingImage();
        }

        const elementsArray: JSX.Element[] = [];

        if (pokePos === PokePos.prev) {
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'symbol questionMark'}
                src={`${nextConfig.basePath}/question_mark.webp`}
                alt={'Question mark symbol'}
                priority={true}
                width={1} height={1}
            />);
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'symbol arrow transformFlip'}
                src={`${nextConfig.basePath}/arrow.png`}
                alt={'Left arrow symbol'}
                priority={true}
                width={1} height={1}
            />);
        }

        elementsArray.push(<div className="pokemonContainer" key={elementsArray.length}>
            {getImageElem(pokemon)}
        </div>);

        if (pokePos === PokePos.next) {
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'symbol arrow'}
                src={`${nextConfig.basePath}/arrow.png`}
                alt={'Right arrow symbol'}
                priority={true}
                width={1} height={1}
            />);
            elementsArray.push(<Image
                key={elementsArray.length}
                className={'symbol questionMark'}
                src={`${nextConfig.basePath}/question_mark.webp`}
                alt={'Question mark symbol'}
                priority={true}
                width={1} height={1}
            />);
        }

        return elementsArray;
    }

    return <div className="quiz2InfoDisplayer">
        {elementsToDisplay()}
    </div>
}
