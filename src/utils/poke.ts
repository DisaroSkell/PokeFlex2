import { Generation } from "../types/generation.type";
import { shuffleArray } from "./utils";

export function pickRandomIdInGens(gens: Generation[]) {
    // Chooses a random gen
    const randomGen = gens[Math.floor(Math.random() * gens.length)];
    // Choose a random pokemon id in this gen
    const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId);

    return randomId;
}

export function createShuffledListOfIdsInGens(gens: Generation[]) {
    const ids: number[] = [];
    gens.forEach(gen => {
        for (let i = gen.firstPokemonId; i <= gen.lastPokemonId; i++)
            ids.push(i);
    });

    return shuffleArray(ids);
}
