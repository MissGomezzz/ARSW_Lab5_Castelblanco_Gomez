import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import BlueprintCanvas from '../src/components/BlueprintCanvas.jsx'

describe('BlueprintCanvas', () => {
  it('renderiza un canvas con id propio y dimensiones 520x360, y llama getContext', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
    const { container } = render(
      <BlueprintCanvas
        points={[
          { x: 10, y: 10 },
          { x: 50, y: 60 },
        ]}
      />,
    )
    const canvas = container.querySelector('#blueprint-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('width', '520')
    expect(canvas).toHaveAttribute('height', '360')
    expect(spy).toHaveBeenCalledWith('2d')
    spy.mockRestore()
  })

  it('en modo interactivo agrega un punto por cada click', () => {
    const onAddPoint = vi.fn()
    const { container } = render(<BlueprintCanvas onAddPoint={onAddPoint} />)

    fireEvent.click(container.querySelector('canvas'), { clientX: 30, clientY: 45 })

    expect(onAddPoint).toHaveBeenCalledWith({ x: 30, y: 45 })
  })
})
