import { describe, it, expect } from 'vitest'
import reducer, {
  deleteBlueprint,
  fetchAllBlueprints,
  fetchByAuthor,
  updateBlueprint,
} from '../src/features/blueprints/blueprintsSlice.js'
import {
  selectAuthors,
  selectTop5ByPoints,
} from '../src/features/blueprints/blueprintsSelectors.js'

const bp = (author, name, n) => ({
  author,
  name,
  points: Array.from({ length: n }, (_, i) => ({ x: i, y: i })),
})

const loaded = (list) =>
  reducer(undefined, { type: fetchAllBlueprints.fulfilled.type, payload: list })

// Minimal action shapes as produced by createAsyncThunk.
const pending = (thunk, arg, requestId = 'r1') => ({
  type: thunk.pending.type,
  meta: { arg, requestId },
})
const rejected = (thunk, arg, requestId = 'r1') => ({
  type: thunk.rejected.type,
  payload: 'boom',
  meta: { arg, requestId, rejectedWithValue: true },
  error: { message: 'Rejected' },
})

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.items).toEqual({})
    expect(state.requests.fetchByAuthor).toEqual({ status: 'idle', error: null })
  })

  it('lleva estado loading/error por thunk', () => {
    let state = reducer(undefined, pending(fetchByAuthor, 'john'))
    expect(state.requests.fetchByAuthor.status).toBe('loading')
    expect(state.requests.fetchAll.status).toBe('idle')
    expect(state.selectedAuthor).toBe('john')

    state = reducer(state, rejected(fetchByAuthor, 'john'))
    expect(state.requests.fetchByAuthor).toEqual({ status: 'failed', error: 'boom' })
  })

  it('selectTop5ByPoints ordena por número de puntos y toma 5', () => {
    const state = {
      blueprints: loaded([
        bp('a', 'p1', 1),
        bp('a', 'p7', 7),
        bp('b', 'p3', 3),
        bp('b', 'p9', 9),
        bp('c', 'p5', 5),
        bp('c', 'p2', 2),
      ]),
    }
    expect(selectTop5ByPoints(state).map((b) => b.name)).toEqual(['p9', 'p7', 'p5', 'p3', 'p2'])
    expect(selectTop5ByPoints(state)).toBe(selectTop5ByPoints(state))
    expect(selectAuthors(state)).toEqual(['a', 'b', 'c'])
  })

  it('delete optimista: quita el plano y lo restaura si falla', () => {
    const arg = { author: 'a', name: 'p1' }
    let state = loaded([bp('a', 'p1', 2)])

    state = reducer(state, pending(deleteBlueprint, arg))
    expect(state.items['a/p1']).toBeUndefined()

    state = reducer(state, rejected(deleteBlueprint, arg))
    expect(state.items['a/p1'].points).toHaveLength(2)
    expect(state.rollback).toEqual({})
  })

  it('update optimista: aplica los puntos y revierte si falla', () => {
    const arg = { author: 'a', name: 'p1', points: [{ x: 9, y: 9 }] }
    let state = loaded([bp('a', 'p1', 3)])

    state = reducer(state, pending(updateBlueprint, arg))
    expect(state.items['a/p1'].points).toEqual([{ x: 9, y: 9 }])

    state = reducer(state, rejected(updateBlueprint, arg))
    expect(state.items['a/p1'].points).toHaveLength(3)
  })
})
