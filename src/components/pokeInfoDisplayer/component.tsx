import type { JSX } from "react";

import arrow from "@/assets/symbols/arrow.png";
import questionMark from "@/assets/symbols/question_mark.webp";

import { PokeInfoOptions, type Pokemon, PokePos, shinyChance } from "@/types/pokemon.type";

import { formatNumberToMinNdigits } from "@/utils/utils";

import "./pokeInfoDisplayer.css";

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
        return <img
            className={'imageAutoFit pokemonImg banana'}
            src={`/Logo.png`}
            alt={'loading'}
            width={1} height={1}
        />;
    }

    function getIDElem (id: number) {
        return <p>
            {formatNumberToMinNdigits(id, 3)}
        </p>;
    }

    function getImageElem (poke: Pokemon) {
        const isShiny = Math.random() < shinyChance;
        const image = isShiny && poke.shinyImgUrl ? poke.shinyImgUrl : poke.imgUrl;

        return <>
        <img
            className={'imageAutoFit pokemonImg'}
            src={image}
            alt={poke.name}
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

    function getNameElem (name: string) {
        return <p>
            {name}
        </p>;
    }

    const elementToDisplay = () => {
        if (!pokemon) {
            return getLoadingImage();
        }

        const elementsArray: JSX.Element[] = [];

        if (pokePos === PokePos.prev) {
            elementsArray.push(<img
                key={elementsArray.length}
                className={'imageAutoFit questionMark'}
                src={questionMark}
                alt={'Question mark symbol'}
                width={1} height={1}
            />);
            elementsArray.push(<img
                key={elementsArray.length}
                className={'imageAutoFit arrow transformFlip'}
                src={arrow}
                alt={'Left arrow symbol'}
                width={1} height={1}
            />);
        }

        let infoElem = <></>;

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
            elementsArray.push(<img
                key={elementsArray.length}
                className={'imageAutoFit arrow'}
                src={arrow}
                alt={'Right arrow symbol'}
                width={1} height={1}
            />);
            elementsArray.push(<img
                key={elementsArray.length}
                className={'imageAutoFit questionMark'}
                src={questionMark}
                alt={'Question mark symbol'}
                width={1} height={1}
            />);
        }

        return elementsArray;
    };

    return <div className="infoDisplayer">
        {elementToDisplay()}
    </div>;
}
