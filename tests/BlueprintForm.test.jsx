import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BlueprintForm from '../src/components/BlueprintForm.jsx'

const canvas = (container) => container.querySelector('#blueprint-editor-canvas')

describe('BlueprintForm', () => {
  it('envía el formulario con los puntos dibujados en el lienzo', () => {
    const onSubmit = vi.fn()
    const { container } = render(<BlueprintForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Autor/i), { target: { value: 'john' } })
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'house' } })
    fireEvent.click(canvas(container), { clientX: 1, clientY: 2 })
    fireEvent.click(canvas(container), { clientX: 30, clientY: 40 })
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      author: 'john',
      name: 'house',
      points: [
        { x: 1, y: 2 },
        { x: 30, y: 40 },
      ],
    })
  })

  it('no envía si no hay puntos y muestra el error', () => {
    const onSubmit = vi.fn()
    render(<BlueprintForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Autor/i), { target: { value: 'john' } })
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'house' } })
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/al menos un punto/i)
  })

  it('deshacer elimina el último punto', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <BlueprintForm
        initial={{ author: 'a', name: 'b', points: [{ x: 1, y: 1 }] }}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(canvas(container), { clientX: 9, clientY: 9 })
    fireEvent.click(screen.getByRole('button', { name: /Deshacer/i }))
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }))

    expect(onSubmit).toHaveBeenCalledWith({ author: 'a', name: 'b', points: [{ x: 1, y: 1 }] })
  })
})
