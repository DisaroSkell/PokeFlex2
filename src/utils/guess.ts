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
