import { RootState } from '../store';
import { createSliceWithThunks } from '../customCreateSlice';

import { PayloadAction } from '@reduxjs/toolkit';

import { defaultLanguage, Lang, supportedLanguages } from "@/src/types/lang.type"
import { getAllOfficialLanguages } from '@/src/apiCalls/lang';

interface LangState {
    langs: Lang[]
    selectedLang: Lang
    loading: boolean
    error: {
        status: number
        message: string
    } | null
}

const initialState: LangState = {
    langs: supportedLanguages,
    selectedLang: defaultLanguage,
    loading: false,
    error: null,
}

export const langSlice = createSliceWithThunks({
    name: 'langs',
    initialState,
    reducers: (create) => ({
        fetchLangs: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                try {
                    return await getAllOfficialLanguages();
                } catch (error: any) {
                    if (error.status && error.message) {
                        return rejectWithValue(error);
                    } else {
                        return rejectWithValue("Unknown error !");
                    }
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                },
                rejected: (state, action) => {
                    state.loading = false;
                    const payload = action.payload as LangState["error"];

                    if (payload?.status && payload?.message) {
                        state.error = payload;
                    } else {
                        state.error = {status: 500, message: "Unknown error !"};
                    }
                },
                fulfilled: (state, action) => {
                    state.loading = false;
                    state.langs = action.payload;
                }
            }
        ),
        setSelectedLang: create.reducer((state, action: PayloadAction<Lang>) => {
            state.selectedLang = action.payload;
        })
    })
});

export const {
    fetchLangs,
    setSelectedLang
} = langSlice.actions;

export const selectIsLoading = (state: RootState) => state.lang.loading;
export const selectCurrentLang = (state: RootState) => state.lang.selectedLang;
export const selectLangs = (state: RootState) => state.lang.langs;
export const selectError = (state: RootState) => state.lang.error;

export default langSlice.reducer;
