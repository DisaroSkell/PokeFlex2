import { configureStore } from '@reduxjs/toolkit'

import pokeGensReducer from './pokeGens/pokeGensSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      gens: pokeGensReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
