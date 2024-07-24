import { Generation } from "../types/generation.type";
import { PokeGuessOptions, PokeInfoOptions } from "../types/pokemon.type";

export function formatStreaksKey(infoOption: PokeInfoOptions, guessOption: PokeGuessOptions, gens: Generation[]) {
    return `${infoOption}-${guessOption}-[${gens.map(g => g.name).toString()}]`
}
