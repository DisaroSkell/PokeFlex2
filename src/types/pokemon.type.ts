import { PokeType } from "./pokeType.type"

export interface Pokemon {
    id: number
    name: string
    imgUrl: string
    shinyImgUrl: string
    type1: PokeType
    type2: PokeType | null
}

export interface PokeName {
    id: number
    name: string
}

export enum PokeInfoOptions {
    ID = 'id',
    Name = 'name',
    Image = 'imgUrl',
}

export enum PokeGuessOptions {
    ID = 'id',
    Name = 'name',
    Types = 'types',
}

export enum PokePos {
    current,
    prev,
    next,
}

export const shinyChance = 1/8192;
