import axios from 'axios'
import { session } from './session.js'

const BLUEPRINTS_PATH = '/api/v1/blueprints'
const LOGIN_PATH = '/auth/login'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 8000,
})

let onUnauthorized = () => {}

/** Lets the store react (logout) when the backend rejects the JWT. */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function toMessage(err) {
  const status = err.response?.status
  const isLogin = err.config?.url === LOGIN_PATH
  if (!err.response) return 'No se pudo conectar con el servidor'
  if (status === 401)
    return isLogin ? 'Credenciales inválidas' : 'Sesión requerida o expirada: inicia sesión'
  if (status === 403) return 'No tienes permisos para esta operación'
  return err.response.data?.message || err.message
}

http.interceptors.request.use((config) => {
  const token = session.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config?.url !== LOGIN_PATH) {
      onUnauthorized()
    }
    const error = new Error(toMessage(err))
    error.status = err.response?.status
    return Promise.reject(error)
  },
)

const blueprintPath = (author, name) =>
  `${BLUEPRINTS_PATH}/${encodeURIComponent(author)}/${encodeURIComponent(name)}`

// The backend wraps every payload as { code, message, data }.
const unwrap = (res) => res.data.data

/** REST implementation of the blueprints service (same interface as apiMock). */
const apiClient = {
  async getAll() {
    return unwrap(await http.get(BLUEPRINTS_PATH))
  },
  async getByAuthor(author) {
    return unwrap(await http.get(`${BLUEPRINTS_PATH}/${encodeURIComponent(author)}`))
  },
  async getByAuthorAndName(author, name) {
    return unwrap(await http.get(blueprintPath(author, name)))
  },
  async create(blueprint) {
    return unwrap(await http.post(BLUEPRINTS_PATH, blueprint))
  },
  async update(author, name, points) {
    return unwrap(await http.put(blueprintPath(author, name), { points }))
  },
  async remove(author, name) {
    await http.delete(blueprintPath(author, name))
  },
  async login(username, password) {
    const { data } = await http.post(LOGIN_PATH, { username, password })
    return data.access_token
  },
}

export default apiClient
