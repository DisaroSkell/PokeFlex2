import { RootState } from '../store';
import { createSliceWithThunks } from '../customCreateSlice';

import { PayloadAction } from '@reduxjs/toolkit';
import { Generation } from '@/src/types/generation.type'
import { getAllGens } from '@/src/apiCalls/generations';
import { Lang } from '@/src/types/lang.type';

interface GenState {
    gens: Generation[]
    selectedGens: number[]
    loading: boolean
    error: {
        status: number
        message: string
    } | null
}

const initialState: GenState = {
  gens: [],
  selectedGens: [],
  loading: false,
  error: null,
}

export const pokeGensSlice = createSliceWithThunks({
    name: 'pokeGens',
    initialState,
    reducers: (create) => ({
        fetchPokeGens: create.asyncThunk<
        Generation[],
        Lang, 
        {
            rejectValue: { status: number, message: string }
        }
    >(
            async (lang, { rejectWithValue }) => {
                try {
                    return await getAllGens(lang);
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
                    const payload = action.payload as GenState["error"];

                    if (payload?.status && payload?.message) {
                        state.error = payload;
                    } else {
                        state.error = {status: 500, message: "Unknown error !"};
                    }
                },
                fulfilled: (state, action) => {
                    state.loading = false;
                    state.gens = action.payload;
                    if (!state.selectedGens.length) state.selectedGens = action.payload.map(gen => gen.id);
                }
            }
        ),
        setSelectedGens: create.reducer((state, action: PayloadAction<Generation[]>) => {
            state.selectedGens = action.payload.map(gen => gen.id);
        }),
        addToSelectedGens: create.reducer((state, action: PayloadAction<Generation>) => {
            if (state.selectedGens.some(genId => genId === action.payload.id)) return;

            state.selectedGens.push(action.payload.id);
        }),
        removeFromSelectedGens: create.reducer((state, action: PayloadAction<Generation>) => {
            const indexToRemove = state.selectedGens.findIndex(genId => genId === action.payload.id);

            if (indexToRemove !== -1) state.selectedGens.splice(indexToRemove, 1);
        })
    })
});

export const {
    fetchPokeGens,
    setSelectedGens,
    addToSelectedGens,
    removeFromSelectedGens
} = pokeGensSlice.actions;

export const selectIsLoading = (state: RootState) => state.gens.loading;
export const selectGens = (state: RootState) => state.gens.gens;
export const selectSelectedGens = (state: RootState) => state.gens.selectedGens;
export const selectError = (state: RootState) => state.gens.error;

export default pokeGensSlice.reducer;
