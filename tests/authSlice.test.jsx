import { describe, it, expect } from 'vitest'
import reducer, { login } from '../src/features/auth/authSlice.js'

describe('auth slice', () => {
  it('login.pending pone status loading y limpia error', () => {
    const state = reducer(undefined, { type: login.pending.type })
    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('login.fulfilled guarda token y username', () => {
    const state = reducer(undefined, {
      type: login.fulfilled.type,
      payload: { token: 'jwt-123', username: 'student' },
    })
    expect(state.status).toBe('succeeded')
    expect(state.token).toBe('jwt-123')
    expect(state.username).toBe('student')
  })

  it('login.rejected guarda el mensaje de error', () => {
    const state = reducer(undefined, {
      type: login.rejected.type,
      payload: 'Credenciales inválidas',
    })
    expect(state.status).toBe('failed')
    expect(state.error).toBe('Credenciales inválidas')
  })
})