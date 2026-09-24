import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../src/components/PrivateRoute.jsx'
import { createAppStore } from '../src/store/index.js'

function renderAt(token) {
  const store = createAppStore({
    auth: { token, username: 'student', status: 'idle', error: null },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/blueprints/new']}>
        <Routes>
          <Route
            path="/blueprints/new"
            element={
              <PrivateRoute>
                <p>Editor privado</p>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('PrivateRoute', () => {
  it('redirige a /login sin sesión', () => {
    renderAt(null)
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('muestra el contenido con sesión', () => {
    renderAt('jwt')
    expect(screen.getByText('Editor privado')).toBeInTheDocument()
  })
})
