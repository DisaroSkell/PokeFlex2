import { PokeGuessOptions, PokeInfoOptions } from "@/src/types/pokemon.type"

import { RootState } from "../store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AutoGiveupSetting {
    enabled: boolean
    selectedTimeBeforeGiveup: number // in seconds
}

interface QuizOptionsSetting {
    infoOption: PokeInfoOptions
    guessOption: PokeGuessOptions
}

interface UserSettingsState {
    autoGiveup: AutoGiveupSetting
    chosenQuizOptions: QuizOptionsSetting
    autoValidate: boolean
    displayTutorial: boolean
}

const initialState: UserSettingsState = {
    autoGiveup: {
        enabled: false,
        selectedTimeBeforeGiveup: 30,
    },
    chosenQuizOptions: {
        infoOption: PokeInfoOptions.Image,
        guessOption: PokeGuessOptions.Name,
    },
    autoValidate: true,
    displayTutorial: true,
}

export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {
        setAllSettings(state, action: PayloadAction<UserSettingsState>) {
            state = action.payload; 
        },
        setAutoGiveupSetting(state, action: PayloadAction<AutoGiveupSetting>) {
            state.autoGiveup = action.payload; 
        },
        setQuizOptionsSetting(state, action: PayloadAction<QuizOptionsSetting>) {
            state.chosenQuizOptions = action.payload; 
        },
        setAutoValidateSetting(state, action: PayloadAction<boolean>) {
            state.autoValidate = action.payload;
        },
        setDisplayTutorialSetting(state, action: PayloadAction<boolean>) {
            state.displayTutorial = action.payload;
        },
    },
})

export const { setAllSettings, setAutoGiveupSetting, setQuizOptionsSetting, setAutoValidateSetting, setDisplayTutorialSetting } = userSettingsSlice.actions;

export const selectUserSettings = (state: RootState) => state.userSettings;
export const selectAutoGiveupSetting = (state: RootState) => state.userSettings.autoGiveup;
export const selectQuizOptionsSetting = (state: RootState) => state.userSettings.chosenQuizOptions;
export const selectAutoValidateSetting = (state: RootState) => state.userSettings.autoValidate;
export const selectDisplayTutorialSetting = (state: RootState) => state.userSettings.displayTutorial;

export default userSettingsSlice.reducer;
