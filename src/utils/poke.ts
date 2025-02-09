import { Generation } from "../types/generation.type";

export function pickRandomIdInGens(gens: Generation[]) {
    // Chooses a random gen
    const randomGen = gens[Math.floor(Math.random() * gens.length)];
    // Choose a random pokemon id in this gen
    const randomId = Math.floor(Math.random() * (randomGen.lastPokemonId - randomGen.firstPokemonId + 1) + randomGen.firstPokemonId);

    return randomId;
}
