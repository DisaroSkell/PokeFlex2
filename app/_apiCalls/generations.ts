import { defaultURL, generationsEndpoint } from "../_types/api.type"
import { Generation } from "../_types/generation.type"

const getAllGens = async (): Promise<Generation[]> => {
    const allGens: Generation[] = []
    let lastEnteredPokemonId = 0

    try {
        const allGensRes = await fetch(defaultURL + generationsEndpoint)
        const allGensJson = await allGensRes.json()

        for (let index = 0; index < allGensJson.results.length; index++) {
            const specificGenRes = await fetch(allGensJson.results[index].url)
            const specificGenJson = await specificGenRes.json()
            
            allGens.push({
                name: specificGenJson.names.find((elem: any) => elem.language.name === 'en').name ?? "",
                firstPokemonId: lastEnteredPokemonId + 1,
                lastPokemonId: lastEnteredPokemonId + specificGenJson.pokemon_species.length
            })

            lastEnteredPokemonId = lastEnteredPokemonId + specificGenJson.pokemon_species.length
        }
    } catch (err) {
        console.error(err)
    }

    return allGens
}

export { getAllGens }