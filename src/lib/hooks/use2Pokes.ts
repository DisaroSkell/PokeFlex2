import { useCallback, useEffect, useState } from "react";

import { getPokeWithId } from "@/src/apiCalls/pokemons";

import { Generation } from "@/src/types/generation.type";
import { Lang } from "@/src/types/lang.type";
import { Pokemon, } from "@/src/types/pokemon.type";

/**
 * Hook to handle a Pokémon
 * @param {Lang} lang current lang of the app
 * @param {Generation[]} gens of the chosen Pokémons
 * @returns [currentPoke, nextPoke, isLoading, changePokes]
 */
export function use2Pokes(
    lang: Lang,
    gens: Generation[]
): [
    Pokemon | null,
    Pokemon | null,
    boolean,
    () => void,
] {
    const QUEUE_CAPACITY = 2;
    const [pokeQueue, setPokeQueue] = useState<{ first: Pokemon, next: Pokemon }[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPoke, setCurrentPoke] = useState<Pokemon | null>(null);
    const [nextPoke, setNextPoke] = useState<Pokemon | null>(null);

    const fillQueueByOne = useCallback(async () => {
        if (gens.length === 0) return;
        
        if (pokeQueue.length === 0) setIsLoading(true);
        // Chooses a random gen
        const randomGen = gens[Math.floor(Math.random() * gens.length)];
        // Choose a random pokemon id in this gen (but not the last since we are going to also take the next one)
        const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId) + randomGen.firstPokemonId);
    
        const poke = await getPokeWithId(randomId, lang);
        const poke2 = await getPokeWithId(randomId + 1, lang);
        if (poke && poke2) setPokeQueue(prevQueue => {
            if (prevQueue.length >= QUEUE_CAPACITY) {
                return prevQueue;
            }

            return [...prevQueue, { first: poke, next: poke2 }];
        });

        setIsLoading(false);
    }, [gens, lang]);

    // Fill queue
    useEffect(() => {
        if (pokeQueue.length >= QUEUE_CAPACITY) return;
        fillQueueByOne();
    }, [pokeQueue, fillQueueByOne]);

    function changePokes() {
        setPokeQueue(currentValue => {
            const newValue = [...currentValue];
            const pokes = newValue.shift();
            setCurrentPoke(pokes?.first ?? null);
            setNextPoke(pokes?.next ?? null);

            return newValue;
        });
    }

    // Clear queue when params change
    useEffect(() => {
        setPokeQueue([]);
        setIsLoading(true);
    }, [lang, gens]);

    return [currentPoke, nextPoke, isLoading, changePokes];
}
