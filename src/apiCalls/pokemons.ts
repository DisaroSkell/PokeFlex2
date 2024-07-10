import { defaultURL, pokemonsEndpoint } from "../types/api.type"

const getPokeWithId = async (pokeId: number): Promise<any> => {
    try {
        const pokeRes = await fetch(defaultURL + pokemonsEndpoint + pokeId)
        
        if (pokeRes.ok) return await pokeRes.json()
    } catch (err) {
        console.error(err)
    }

    return null
}

export { getPokeWithId }