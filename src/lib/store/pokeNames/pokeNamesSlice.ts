import { createSliceWithThunks } from '../customCreateSlice';

import { getAllPokeNames } from '../../../apiCalls/pokemons';

import type { Lang } from '../../../types/lang.type';
import type { PokeName } from '../../../types/pokemon.type';
import type { RootState } from '../store';

interface PokeNamesState {
    names: PokeName[]
    loading: boolean
    error: {
        status: number
        message: string
    } | null
}

const initialState: PokeNamesState = {
  names: [],
  loading: false,
  error: null,
};

export const pokeNamesSlice = createSliceWithThunks({
    name: 'pokeNames',
    initialState,
    reducers: (create) => ({
        fetchPokeNames: create.asyncThunk<
            PokeName[],
            Lang,
            {
                rejectValue: { status: number, message: string }
            }
        >(
            async (lang, { rejectWithValue }) => {
                try {
                    return await getAllPokeNames(lang);
                } catch (error: any) {
                    if (error.status && error.message) {
                        return rejectWithValue(error);
                    } else {
                        return rejectWithValue({status: 500, message: "Unknown error !"});
                    }
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                },
                rejected: (state, action) => {
                    state.loading = false;
                    const payload = action.payload as PokeNamesState["error"];

                    if (payload?.status && payload?.message) {
                        state.error = payload;
                    } else {
                        state.error = {status: 500, message: "Unknown error !"};
                    }
                },
                fulfilled: (state, action) => {
                    state.loading = false;
                    state.names = action.payload;
                }
            }
        )
    })
});

export const {
    fetchPokeNames
} = pokeNamesSlice.actions;

export const selectIsLoading = (state: RootState) => state.pokeNames.loading;
export const selectPokeNames = (state: RootState) => state.pokeNames.names;
export const selectError = (state: RootState) => state.pokeNames.error;

export default pokeNamesSlice.reducer;
