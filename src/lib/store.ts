import { configureStore } from '@reduxjs/toolkit'

import pokeGensReducer from './pokeGens/pokeGensSlice';
import langReducer from './lang/langSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      gens: pokeGensReducer,
      lang: langReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
