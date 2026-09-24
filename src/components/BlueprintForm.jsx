import { useState } from 'react'
import BlueprintCanvas from './BlueprintCanvas.jsx'

const EMPTY = { author: '', name: '', points: [] }

/** Create/edit form: the points are drawn by clicking on the canvas. */
export default function BlueprintForm({
  initial = EMPTY,
  lockIdentity = false,
  submitting = false,
  onSubmit,
}) {
  const [author, setAuthor] = useState(initial.author)
  const [name, setName] = useState(initial.name)
  const [points, setPoints] = useState(initial.points)
  const [error, setError] = useState(null)

  const addPoint = (point) => setPoints((prev) => [...prev, point])
  const undo = () => setPoints((prev) => prev.slice(0, -1))
  const clear = () => setPoints([])

  const submit = (event) => {
    event.preventDefault()
    if (!author.trim() || !name.trim()) {
      setError('El autor y el nombre son obligatorios')
      return
    }
    if (!points.length) {
      setError('Haz click en el lienzo para agregar al menos un punto')
      return
    }
    setError(null)
    onSubmit({ author: author.trim(), name: name.trim(), points })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bp-author" className="label">
            Autor
          </label>
          <input
            id="bp-author"
            className="input"
            value={author}
            disabled={lockIdentity}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="juan.perez"
          />
        </div>
        <div>
          <label htmlFor="bp-name" className="label">
            Nombre
          </label>
          <input
            id="bp-name"
            className="input"
            value={name}
            disabled={lockIdentity}
            onChange={(e) => setName(e.target.value)}
            placeholder="mi-dibujo"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="label mb-0">Haz click en el lienzo para agregar puntos</span>
          <span className="text-sm text-slate-400">{points.length} puntos</span>
        </div>
        <BlueprintCanvas id="blueprint-editor-canvas" points={points} onAddPoint={addPoint} />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={undo} disabled={!points.length}>
          Deshacer último punto
        </button>
        <button type="button" className="btn" onClick={clear} disabled={!points.length}>
          Limpiar
        </button>
        <button type="submit" className="btn btn-primary ml-auto" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
