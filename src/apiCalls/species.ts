import { defaultURL, speciesEndpoint } from "../types/api.type"
import { Lang } from "../types/lang.type"

const getPokeNameWithId = async (pokeId: number, lang: Lang): Promise<string | null> => {
    try {
        const pokeRes = await fetch(defaultURL + speciesEndpoint + pokeId)
        
        if (pokeRes.ok) {
            const json = await pokeRes.json()

            if (
                !json.names
                || !json.names.length
            ) {
                return null
            }

            const foundLanguage = json.names.find((entity: any) => entity.language.name === lang.id)

            if (typeof foundLanguage?.name !== "string") return null

            return foundLanguage.name
        }
    } catch (err) {
        console.error(err)
    }

    return null
}

export { getPokeNameWithId }