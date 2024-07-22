import { defaultURL, langEndpoint } from "../types/api.type"
import { Lang } from "../types/lang.type"

const getAllOfficialLanguages = async (): Promise<Lang[]> => {
    try {
        const langRes = await fetch(defaultURL + langEndpoint)
        
        if (langRes.ok) {
            const json = await langRes.json()

            if (
                !json.results
                || !json.results.length
            ) {
                return []
            }

            const allLanguages: Lang[] = []

            for (let i = 0; i < json.results.length; i++) {
                const tryFullName = new Intl.DisplayNames([json.results[i].name], { type: 'language' }).of(json.results[i].name)

                if (tryFullName) allLanguages.push({
                    id: json.results[i].name,
                    fullName: tryFullName
                })
            }

            return allLanguages
        }
    } catch (err) {
        console.error(err)
    }

    return []
}

export { getAllOfficialLanguages }