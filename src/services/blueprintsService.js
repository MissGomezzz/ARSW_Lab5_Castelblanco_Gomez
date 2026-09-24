import apiClient from './apiClient.js'
import apiMock from './apiMock.js'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** Single switch between the in-memory mock and the real REST API (see VITE_USE_MOCK in .env). */
const blueprintsService = USE_MOCK ? apiMock : apiClient

export default blueprintsService
