'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { makeStore, AppStore } from '@/src/lib/store/store'

interface StoreProviderProps {
    children: React.ReactNode
}

export default function StoreProvider({
  children
}: StoreProviderProps) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>
    <PersistGate persistor={storeRef.current.persistor}>
      {children}
    </PersistGate>
  </Provider>
}
