import { configureStore } from '@reduxjs/toolkit'
import blueprintsReducer from '../features/blueprints/blueprintsSlice.js'
import authReducer, { logout } from '../features/auth/authSlice.js'
import { setUnauthorizedHandler } from '../services/apiClient.js'

export function createAppStore(preloadedState) {
  return configureStore({
    reducer: {
      blueprints: blueprintsReducer,
      auth: authReducer,
    },
    preloadedState,
  })
}

const store = createAppStore()

setUnauthorizedHandler(() => store.dispatch(logout()))

export default store
