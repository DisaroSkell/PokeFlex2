import { useCallback, useEffect, useState } from "react";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { Generation } from "@/src/types/generation.type";
import { Lang } from "@/src/types/lang.type";
import { Pokemon, } from "@/src/types/pokemon.type";

import { createShuffledListOfIdsInGens } from "@/src/utils/poke";

/**
 * Hook to handle a Pokémon
 * @param {Lang} lang current lang of the app
 * @param {Generation[]} gens of the chosen Pokémons
 * @returns [currentPoke, isLoading, changePoke]
 */
export function usePoke(
    lang: Lang,
    gens: Generation[]
): [
    Pokemon | null,
    boolean,
    () => void,
] {
    const [rngList, setRngList] = useState<number[]>([]);

    const QUEUE_CAPACITY = 2;
    const [pokeQueue, setPokeQueue] = useState<Pokemon[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null);

    const fillQueueByOne = useCallback(async () => {
        if (gens.length === 0) return;
        
        if (pokeQueue.length === 0) setIsLoading(true);
        if (rngList.length === 0)
            setRngList(createShuffledListOfIdsInGens(gens));
        const randomId = rngList.shift();
        if (!randomId) return;
        
        const poke = await getPokeWithId(randomId, lang);
        if (poke) setPokeQueue(prevQueue => {
            if (prevQueue.length >= QUEUE_CAPACITY) {
                return prevQueue;
            }

            return [...prevQueue, poke];
        });

        setIsLoading(false);
    }, [gens, lang, rngList]);

    // Fill queue
    useEffect(() => {
        if (pokeQueue.length >= QUEUE_CAPACITY) return;
        fillQueueByOne();
    }, [pokeQueue, fillQueueByOne]);

    // Clear queue when params change
    useEffect(() => {
        setRngList(createShuffledListOfIdsInGens(gens));
        setPokeQueue([]);
        setIsLoading(true);
    }, [lang, gens]);

    function changePoke() {
        setPokeQueue(currentValue => {
            const newValue = [...currentValue];
            setCurrentPoke(newValue.shift() ?? null);

            return newValue;
        });
    }

    return [currentPoke, isLoading, changePoke];
}
