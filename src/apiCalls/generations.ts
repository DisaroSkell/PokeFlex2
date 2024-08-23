import { defaultURL, generationsEndpoint } from "../types/api.type"
import { Generation } from "../types/generation.type"
import { Lang } from "../types/lang.type"

const getAllGens = async (lang: Lang): Promise<Generation[]> => {
    const allGens: Generation[] = []
    let lastEnteredPokemonId = 0

    try {
        const allGensRes = await fetch(defaultURL + generationsEndpoint)
        const allGensJson = await allGensRes.json()

        for (let index = 0; index < allGensJson.results.length; index++) {
            const specificGenRes = await fetch(allGensJson.results[index].url)
            const specificGenJson = await specificGenRes.json()

            allGens.push({
                id: specificGenJson.id,
                name: specificGenJson.names.find((elem: any) => {
                    return elem.language.name.toLowerCase() === lang.id.toLowerCase()
                }).name ?? "",
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
