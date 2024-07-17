import { defaultURL, pokemonsEndpoint } from "../types/api.type"
import { Pokemon } from "../types/pokemon.type"

const getPokeWithId = async (pokeId: number): Promise<Pokemon | null> => {
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

            const shinyImgUrl = json.sprites.front_shiny ? json.sprites.front_shiny : '';

            return {
                id: json.id,
                name: json.name,
                imgUrl: json.sprites.front_default,
                shinyImgUrl,
                type1: json.types[0].type.name,
                type2: json.types.length > 1 ? json.types[1].type.name : null,
            }
        }
    } catch (err) {
        console.error(err)
    }

    return null
}

export { getPokeWithId }