import { defaultURL, gqlURL, pokemonsEndpoint } from "../types/api.type"
import { Lang } from "../types/lang.type"
import { Pokemon } from "../types/pokemon.type"
import { getPokeType } from "./pokeTypes"

import { getPokeNameWithId } from "./species"

const getPokeWithId = async (pokeId: number, lang: Lang): Promise<Pokemon | null> => {
    try {
        const pokeRes = await fetch(defaultURL + pokemonsEndpoint + pokeId)
        
        if (pokeRes.ok) {
            const json = await pokeRes.json()

            if (
                !json.id
                || !json.name
                || !json.sprites?.front_default
                /* || !json.sprites?.front_shiny */
                || !json.types
                || !json.types[0]?.type?.name
            ) {
                return null
            }

            const pokemonTranslatedName = await getPokeNameWithId(json.id, lang);
            if (!pokemonTranslatedName) return null;

            const pokemonType1 = await getPokeType(json.types[0].type.url, lang);
            if (!pokemonType1) return null;

            const pokemonType2 = json.types[1]?.type?.url ? await getPokeType(json.types[1].type.url, lang) : null;

            const shinyImgUrl = json.sprites.front_shiny ? json.sprites.front_shiny : '';

            return {
                id: json.id,
                name: pokemonTranslatedName,
                imgUrl: json.sprites.front_default,
                shinyImgUrl,
                type1: pokemonType1,
                type2: pokemonType2,
            }
        }
    } catch (err) {
        console.error(err)
    }

    return null
}

const getAllPokeNames = async (lang: Lang): Promise<{id: number, name: string}[]> => {
    try {
        const pokeRes = await fetch(gqlURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `{
                    pokemon_v2_pokemonspeciesname(where: {
                        pokemon_v2_language: {
                            name: {_eq: ${lang.id}}
                        }
                    }) {
                        name
                        pokemon_species_id
                    }
                }`
            })
        });

        const json = await pokeRes.json()

        // TODO : make verifs so that it doesn't do weird shit
        return json.data.pokemon_v2_pokemonspeciesname.map((poke: any) => {
            return {
                id: poke.pokemon_species_id,
                name: poke.name
            }
        })
    } catch (err) {
        console.error(err);
    }

    return [];
}

export { getPokeWithId, getAllPokeNames }
