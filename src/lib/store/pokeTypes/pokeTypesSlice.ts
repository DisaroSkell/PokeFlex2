import { RootState } from '../store';
import { createSliceWithThunks } from '../customCreateSlice';

import { getAllPokeTypes } from '@/src/apiCalls/pokeTypes';

import { PokeType } from '@/src/types/pokeType.type'
import { Lang } from '@/src/types/lang.type';

interface PokeTypeState {
    types: PokeType[]
    loading: boolean
    error: {
        status: number
        message: string
    } | null
}

const initialState: PokeTypeState = {
  types: [],
  loading: false,
  error: null,
}

export const pokeTypesSlice = createSliceWithThunks({
    name: 'pokeTypes',
    initialState,
    reducers: (create) => ({
        fetchPokeTypes: create.asyncThunk<
            PokeType[],
            Lang, 
            {
                rejectValue: { status: number, message: string }
            }
        >(
            async (lang, { rejectWithValue }) => {
                try {
                    return await getAllPokeTypes(lang);
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
                    const payload = action.payload as PokeTypeState["error"];

                    if (payload?.status && payload?.message) {
                        state.error = payload;
                    } else {
                        state.error = {status: 500, message: "Unknown error !"};
                    }
                },
                fulfilled: (state, action) => {
                    state.loading = false;
                    state.types = action.payload;
                }
            }
        )
    })
});

export const {
    fetchPokeTypes
} = pokeTypesSlice.actions;

export const selectIsLoading = (state: RootState) => state.pokeTypes.loading;
export const selectPokeTypes = (state: RootState) => state.pokeTypes.types;
export const selectError = (state: RootState) => state.pokeTypes.error;

export default pokeTypesSlice.reducer;
