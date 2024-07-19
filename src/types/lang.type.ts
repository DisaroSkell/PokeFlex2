export interface Lang {
    id: string
    fullName: string
}

export const defaultLanguages = {
    english: {
        id: "en",
        fullName: "English"
    },
    french: {
        id: "fr",
        fullName: "Français"
    },
    japanese: {
        id: "ja-Hrkt",
        fullName: "日本語"
    }
}