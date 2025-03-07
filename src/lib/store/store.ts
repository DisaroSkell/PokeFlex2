import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from 'redux-persist'
import storage from './storage'

import pokeGensReducer from './pokeGens/pokeGensSlice';
import langReducer from './lang/langSlice';
import streakReducer from './streak/streakSlice';
import pokeNamesReducer from './pokeNames/pokeNamesSlice';
import pokeTypesReducer from './pokeTypes/pokeTypesSlice';
import userSettingsReducer from './userSettings/userSettingsSlice';

const rootReducer = combineReducers({
    gens: pokeGensReducer,
    lang: langReducer,
    streak: streakReducer,
    pokeNames: pokeNamesReducer,
    pokeTypes: pokeTypesReducer,
    userSettings: userSettingsReducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
    let store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    })

    let persistor = persistStore(store)

    return { ...store, persistor }
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
