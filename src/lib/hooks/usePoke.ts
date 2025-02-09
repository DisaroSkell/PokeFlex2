import { useCallback, useEffect, useState } from "react";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { Generation } from "@/src/types/generation.type";
import { Lang } from "@/src/types/lang.type";
import { Pokemon, } from "@/src/types/pokemon.type";

import { pickRandomIdInGens } from "@/src/utils/poke";

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
    const QUEUE_CAPACITY = 2;
    const [pokeQueue, setPokeQueue] = useState<Pokemon[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null);

    const fillQueueByOne = useCallback(async () => {
        if (gens.length === 0) return;
        
        if (pokeQueue.length === 0) setIsLoading(true);
        const randomId = pickRandomIdInGens(gens);
        
        const poke = await getPokeWithId(randomId, lang);
        if (poke) setPokeQueue(prevQueue => {
            if (prevQueue.length >= QUEUE_CAPACITY) {
                return prevQueue;
            }

            return [...prevQueue, poke];
        });

        setIsLoading(false);
    }, [gens, lang]);

    // Fill queue
    useEffect(() => {
        if (pokeQueue.length >= QUEUE_CAPACITY) return;
        fillQueueByOne();
    }, [pokeQueue, fillQueueByOne]);

    function changePoke() {
        setPokeQueue(currentValue => {
            const newValue = [...currentValue];
            setCurrentPoke(newValue.shift() ?? null);

            return newValue;
        });
    }

    // Clear queue when params change
    useEffect(() => {
        setPokeQueue([]);
        setIsLoading(true);
    }, [lang, gens]);

    return [currentPoke, isLoading, changePoke];
}
