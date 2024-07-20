import { defaultURL, pokeTypesEndpoint } from "../types/api.type"
import { Lang } from "../types/lang.type"
import { PokeType } from "../types/pokeType.type"

const getPokeType = async (directURL: string, lang: Lang): Promise<PokeType|null> => {
    try {
        const res = await fetch(directURL);
        const json = await res.json();

        if (!json.name
            || !json.names
            || !json.names.length
        ) {
            return null;
        }

        const foundLanguage = json.names.find((entity: any) => entity.language.name === lang.id);

        if (typeof foundLanguage?.name !== "string") return null;

        return {
            id: json.name,
            fullName: foundLanguage.name
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}

const getAllPokeTypes = async (lang: Lang): Promise<PokeType[]> => {
    const allPokeTypes: PokeType[] = [];

    try {
        const allPokeTypesRes = await fetch(defaultURL + pokeTypesEndpoint)
        const allPokeTypesJson = await allPokeTypesRes.json();

        for (let index = 0; index < allPokeTypesJson.results.length; index++) {
            const typeUrl = allPokeTypesJson.results[index].url;

            if (!typeUrl) {
                continue;
            }

            const foundType = await getPokeType(typeUrl, lang)

            if (foundType) allPokeTypes.push(foundType)
        }
    } catch (err) {
        console.error(err);
    }

    return allPokeTypes;
}

export { getPokeType, getAllPokeTypes }