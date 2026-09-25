import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import BlueprintsPage from '../src/pages/BlueprintsPage.jsx'
import { createAppStore } from '../src/store/index.js'
import blueprintsService from '../src/services/blueprintsService.js'

vi.mock('../src/services/blueprintsService.js', () => ({
  USE_MOCK: true,
  default: {
    getAll: vi.fn(),
    getByAuthor: vi.fn(),
    getByAuthorAndName: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    login: vi.fn(),
  },
}))

const house = {
  author: 'john',
  name: 'house',
  points: [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ],
}
const garage = { author: 'john', name: 'garage', points: [{ x: 5, y: 5 }] }

function renderPage() {
  const store = createAppStore()
  render(
    <Provider store={store}>
      <MemoryRouter>
        <BlueprintsPage />
      </MemoryRouter>
    </Provider>,
  )
  return store
}

describe('BlueprintsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    blueprintsService.getAll.mockResolvedValue([house, garage])
    blueprintsService.getByAuthor.mockResolvedValue([house, garage])
    blueprintsService.getByAuthorAndName.mockResolvedValue(house)
  })

  it('consulta los planos del autor (fetchByAuthor) y los lista en la tabla', async () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'john' } })
    fireEvent.click(screen.getByRole('button', { name: /Get blueprints/i }))

    expect(blueprintsService.getByAuthor).toHaveBeenCalledWith('john')
    const table = await screen.findByRole('table')
    expect(within(table).getByText('house')).toBeInTheDocument()
    expect(within(table).getByText('garage')).toBeInTheDocument()
    expect(screen.getByText(/Total user points: 3/)).toBeInTheDocument()
  })

  it('Open actualiza el plano actual desde el estado global', async () => {
    const store = renderPage()

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'john' } })
    fireEvent.click(screen.getByRole('button', { name: /Get blueprints/i }))
    const table = await screen.findByRole('table')
    const houseRow = within(table).getByText('house').closest('tr')
    fireEvent.click(within(houseRow).getByRole('button', { name: 'Open' }))

    expect(await screen.findByDisplayValue('house')).toBeInTheDocument()
    expect(blueprintsService.getByAuthorAndName).toHaveBeenCalledWith('john', 'house')
    expect(store.getState().blueprints.currentKey).toBe('john/house')
  })

  it('muestra el error cuando el autor no existe', async () => {
    blueprintsService.getByAuthor.mockRejectedValue(new Error('No blueprints for author: nobody'))
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'nobody' } })
    fireEvent.click(screen.getByRole('button', { name: /Get blueprints/i }))

    expect(await screen.findByText('No blueprints for author: nobody')).toBeInTheDocument()
  })
  it('reintenta la consulta al hacer click en Reintentar', async () => {
    blueprintsService.getByAuthor
      .mockRejectedValueOnce(new Error('falló'))
      .mockResolvedValueOnce([house])
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'john' } })
    fireEvent.click(screen.getByRole('button', { name: /Get blueprints/i }))
    await screen.findByText('falló')

    fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }))
    const table = await screen.findByRole('table')
    expect(within(table).getByText('house')).toBeInTheDocument()
    expect(blueprintsService.getByAuthor).toHaveBeenCalledTimes(2)
  })
})
