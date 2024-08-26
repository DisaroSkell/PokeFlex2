import { RootState } from "../store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AutoGiveupSetting {
    enabled: boolean
    selectedTimeBeforeGiveup: number // in seconds
}

interface UserSettingsState {
    autoGiveup: AutoGiveupSetting
}

const initialState: UserSettingsState = {
    autoGiveup: {
        enabled: false,
        selectedTimeBeforeGiveup: 30,
    }
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
    },
})

export const { setAllSettings, setAutoGiveupSetting } = userSettingsSlice.actions;

export const selectUserSettings = (state: RootState) => state.userSettings;

export default userSettingsSlice.reducer;
