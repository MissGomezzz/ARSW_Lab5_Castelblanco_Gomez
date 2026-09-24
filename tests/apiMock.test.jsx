import { describe, it, expect, beforeEach } from 'vitest'
import apiMock, { resetMock } from '../src/services/apiMock.js'
import apiClient from '../src/services/apiClient.js'

describe('apimock', () => {
  beforeEach(() => resetMock())

  it('expone la misma interfaz que apiclient', () => {
    expect(Object.keys(apiMock).sort()).toEqual(Object.keys(apiClient).sort())
  })

  it('crea un blueprint y luego lo consulta por autor y nombre', async () => {
    const bp = { author: 'ana', name: 'casa', points: [{ x: 1, y: 2 }] }
    await apiMock.create(bp)
    await expect(apiMock.getByAuthorAndName('ana', 'casa')).resolves.toEqual(bp)
  })

  it('rechaza cuando el autor no tiene planos', async () => {
    await expect(apiMock.getByAuthor('nadie')).rejects.toThrow('No blueprints for author: nadie')
  })
})
