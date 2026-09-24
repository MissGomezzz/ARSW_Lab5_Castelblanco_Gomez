const LATENCY_MS = 250

const SEED = [
  {
    author: 'john',
    name: 'house',
    points: [
      { x: 80, y: 300 },
      { x: 80, y: 160 },
      { x: 160, y: 90 },
      { x: 240, y: 160 },
      { x: 240, y: 300 },
      { x: 80, y: 300 },
    ],
  },
  {
    author: 'john',
    name: 'garage',
    points: [
      { x: 300, y: 300 },
      { x: 300, y: 200 },
      { x: 460, y: 200 },
      { x: 460, y: 300 },
      { x: 300, y: 300 },
    ],
  },
  {
    author: 'jane',
    name: 'garden',
    points: [
      { x: 40, y: 320 },
      { x: 100, y: 260 },
      { x: 160, y: 300 },
      { x: 220, y: 240 },
      { x: 280, y: 280 },
      { x: 340, y: 220 },
      { x: 400, y: 260 },
      { x: 460, y: 200 },
    ],
  },
  {
    author: 'jane',
    name: 'pool',
    points: [
      { x: 120, y: 120 },
      { x: 400, y: 120 },
      { x: 400, y: 240 },
      { x: 120, y: 240 },
      { x: 120, y: 120 },
    ],
  },
  {
    author: 'samuel',
    name: 'star',
    points: [
      { x: 260, y: 50 },
      { x: 292, y: 136 },
      { x: 384, y: 140 },
      { x: 312, y: 197 },
      { x: 336, y: 285 },
      { x: 260, y: 235 },
      { x: 184, y: 285 },
      { x: 208, y: 197 },
      { x: 136, y: 140 },
      { x: 228, y: 136 },
      { x: 260, y: 50 },
    ],
  },
  {
    author: 'angela',
    name: 'bridge',
    points: [
      { x: 40, y: 260 },
      { x: 120, y: 200 },
      { x: 200, y: 180 },
      { x: 260, y: 175 },
      { x: 320, y: 180 },
      { x: 400, y: 200 },
      { x: 480, y: 260 },
    ],
  },
]

const USERS = { student: 'student123', assistant: 'assistant123' }

const keyOf = (author, name) => `${author}:${name}`

let blueprints = new Map()

/** Restores the seed data (used by tests to isolate cases). */
export function resetMock() {
  blueprints = new Map(SEED.map((bp) => [keyOf(bp.author, bp.name), structuredClone(bp)]))
}
resetMock()

const respond = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), LATENCY_MS))

const fail = (message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), LATENCY_MS))

/** In-memory implementation of the blueprints service (same interface as apiClient). */
const apiMock = {
  getAll() {
    return respond([...blueprints.values()])
  },
  getByAuthor(author) {
    const found = [...blueprints.values()].filter((bp) => bp.author === author)
    return found.length ? respond(found) : fail(`No blueprints for author: ${author}`)
  },
  getByAuthorAndName(author, name) {
    const bp = blueprints.get(keyOf(author, name))
    return bp ? respond(bp) : fail(`Blueprint not found: ${author}/${name}`)
  },
  create(blueprint) {
    const key = keyOf(blueprint.author, blueprint.name)
    if (blueprints.has(key)) return fail(`Blueprint already exists: ${key}`)
    blueprints.set(key, structuredClone(blueprint))
    return respond(blueprint)
  },
  update(author, name, points) {
    const key = keyOf(author, name)
    if (!blueprints.has(key)) return fail(`Blueprint not found: ${author}/${name}`)
    const updated = { author, name, points }
    blueprints.set(key, structuredClone(updated))
    return respond(updated)
  },
  remove(author, name) {
    if (!blueprints.delete(keyOf(author, name)))
      return fail(`Blueprint not found: ${author}/${name}`)
    return respond(undefined)
  },
  login(username, password) {
    return USERS[username] === password ? respond('mock-jwt-token') : fail('Credenciales inválidas')
  },
}

export default apiMock
