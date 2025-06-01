import { PokeName } from "../types/pokemon.type";
import { PokeType } from "../types/pokeType.type";

import { normalizePokeName } from "./utils";

interface guessReturnType {
    success: boolean,
    feedback: string
}

export function guessWithID (guess: number, idToGuess: number): guessReturnType {
    if (guess === idToGuess) {
        return {
            success: true,
            feedback: "right"
        };
    } else {
        const diff = Math.abs(guess - idToGuess)
        let feedback = "wrong"

        if(diff <= 5) feedback = "close";
        else if(diff === 10) feedback = "stupid";
        else if(diff % 100 === 0) feedback = "far";

        return {
            success: false,
            feedback
        };
    }
}

export function guessWithName (guess: string, nameToGuess: string): guessReturnType {
    const normalizedGuess = normalizePokeName(guess);
    const normalizedName = normalizePokeName(nameToGuess);

    if (normalizedGuess === normalizedName) {
        return {
            success: true,
            feedback: "right"
        };
    } else {
        let feedback = "wrong"

        // if(normalizedName.includes(normalizedGuess) || normalizedGuess.includes(normalizedName)) feedback = "close";

        return {
            success: false,
            feedback
        };
    }
}

export function guessWithTypes (
    guessForType1: PokeType,
    guessForType2: PokeType | null,
    typesToGuess: {type1: PokeType; type2: PokeType|null}
): guessReturnType {
    if (!typesToGuess.type2) {
        if (guessForType2) {
            return {
                success: false,
                feedback: "onetype"
            };
        }

        if (typesToGuess.type1.id === guessForType1.id) {
            return {
                success: true,
                feedback: "right"
            };
        }

        return {
            success: false,
            feedback: "wrong"
        };
    }

    if (!guessForType2) {
        return {
            success: false,
            feedback: "twotypes"
        };
    }

    let type1Found = false
    if (guessForType1.id === typesToGuess.type1.id
    || guessForType1.id === typesToGuess.type2.id) {
        type1Found = true
    }

    let type2Found = false
    if (guessForType2.id === typesToGuess.type1.id
    || guessForType2.id === typesToGuess.type2.id) {
        type2Found = true
    }

    if (type1Found && type2Found) return {
        success: true,
        feedback: "right"
    };

    if (type1Found || type2Found) return {
        success: false,
        feedback: "halfright"
    };

    return {
        success: false,
        feedback: "wrong"
    };
}

/**
 * This function tries to guess the pokeName if the input is included in the pokeNames array
 * @param input what is currently in the input for the name
 * @param pokeName name of the pokemon we are trying to guess
 * @param pokeNames list of all pokemon names
 * @returns guessReturnType if input corresponds to a name, else returns null
 */
export function tryAutoGuess (input: string, pokeName: string, pokeNames: PokeName[]): guessReturnType | null {
    const startsWith: string[] = [];
    let foundName: string | undefined = undefined;
    const normedInput = normalizePokeName(input);
    pokeNames.forEach(elem => {
        const normedName = normalizePokeName(elem.name);
        if (normedName === normedInput) {
            foundName = elem.name;
        } else if (normedName.startsWith(normedInput)) {
            startsWith.push(elem.name);
        }
    })

    if (foundName) {
        const guessResult = guessWithName(input, pokeName);

        if (guessResult.success) {
            return guessResult;
        } else if (startsWith.length === 0) {
            return {
                success: false,
                feedback: `wrong-autovalidate`,
            }
        }
    }

    return null;
}
