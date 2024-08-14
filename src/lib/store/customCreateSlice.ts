import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit'

// Custom redux slicer to handle async thunks
export const createSliceWithThunks = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})