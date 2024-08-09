import { RootState } from "../store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface streakState {
    // Key example : "PokeInfoOptions.ID-PokeGuessOptions.Name-[1,2,3,4,5,6,7]"
    maxStreaks: Record<string, number>
    loading: boolean
    error: {
        status: number
        message: string
    } | null
}

const initialState: streakState = {
    maxStreaks: {},
    loading: false,
    error: null,
}

export const streakSlice = createSlice({
    name: 'streak',
    initialState,
    reducers: {
        incrementStreak(state, action: PayloadAction<string>) {
            const streaks = state.maxStreaks;
            const key = action.payload;
            const streakValue = streaks[key];

            if (streakValue === undefined) {
                streaks[key] = 1;
            } else {
                streaks[key] = streakValue + 1;
            }
        }
    },
})

export const { incrementStreak } = streakSlice.actions;

export const selectIsLoading = (state: RootState) => state.streak.loading;
export const selectStreaks = (state: RootState) => state.streak.maxStreaks;
export const selectStreak = (state: RootState, key: string) => state.streak.maxStreaks[key] ?? 0;
export const selectError = (state: RootState) => state.streak.error;

export default streakSlice.reducer;
