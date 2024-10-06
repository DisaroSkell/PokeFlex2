import { useEffect, useState } from "react";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { Generation } from "@/src/types/generation.type";
import { Lang } from "@/src/types/lang.type";
import { Pokemon, } from "@/src/types/pokemon.type";

/**
 * Hook to handle a Pokémon
 * @param {Lang} lang current lang of the app
 * @param {Generation[]} gens of the chosen Pokémons
 * @returns [currentPoke, isLoading, changePoke, nextPoke, changePokes]
 */
export function usePoke(
    lang: Lang,
    gens: Generation[]
): [
    Pokemon | null,
    boolean,
    () => void,
    Pokemon | null,
    () => void,
] {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null);
    const [nextPoke, setNextPoke] = useState<Pokemon | null>(null);

    function changePoke() {
        // Chooses a random gen
        const randomGen = gens[Math.floor(Math.random() * gens.length)];
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId);

        setIsLoading(true);
        getPokeWithId(randomId, lang)
            .then((poke) => {
                setCurrentPoke(poke);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setCurrentPoke(null);
                setIsLoading(false);
            })
    }

    function changePokes() {
        // Chooses a random gen
        const randomGen = gens[Math.floor(Math.random() * gens.length)];
        // Choose a random pokemon id in this gen
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId) + randomGen.firstPokemonId);

        setIsLoading(true);
        setCurrentPoke(null);
        setNextPoke(null);
        getPokeWithId(randomId, lang)
            .then((poke) => {
                setCurrentPoke(poke);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            })
        getPokeWithId(randomId + 1, lang)
            .then((poke) => {
                setNextPoke(poke);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        if (currentPoke && nextPoke) setIsLoading(false);
    }, [currentPoke, nextPoke]);

    return [currentPoke, isLoading, changePoke, nextPoke, changePokes];
}
