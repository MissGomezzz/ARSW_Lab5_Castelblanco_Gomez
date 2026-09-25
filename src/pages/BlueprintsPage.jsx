import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteBlueprint,
  fetchAllBlueprints,
  fetchBlueprint,
  fetchByAuthor,
} from '../features/blueprints/blueprintsSlice.js'
import {
  selectAuthorBlueprints,
  selectAuthorTotalPoints,
  selectAuthors,
  selectCurrentBlueprint,
  selectRequest,
  selectSelectedAuthor,
} from '../features/blueprints/blueprintsSelectors.js'
import { selectIsAuthenticated } from '../features/auth/authSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import BlueprintList from '../components/BlueprintList.jsx'
import RequestStatus from '../components/RequestStatus.jsx'
import TopBlueprints from '../components/TopBlueprints.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedAuthor = useSelector(selectSelectedAuthor)
  const items = useSelector(selectAuthorBlueprints)
  const totalPoints = useSelector(selectAuthorTotalPoints)
  const authors = useSelector(selectAuthors)
  const current = useSelector(selectCurrentBlueprint)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const fetchAllRequest = useSelector(selectRequest('fetchAll'))
  const byAuthorRequest = useSelector(selectRequest('fetchByAuthor'))
  const blueprintRequest = useSelector(selectRequest('fetchBlueprint'))
  const removeRequest = useSelector(selectRequest('remove'))
  const [authorInput, setAuthorInput] = useState(selectedAuthor)
  const [lastOpened, setLastOpened] = useState(null)


  useEffect(() => {
    dispatch(fetchAllBlueprints())
  }, [dispatch, isAuthenticated])

  const searchAuthor = (author) => {
    const value = author.trim()
    if (!value) return
    setAuthorInput(value)
    dispatch(fetchByAuthor(value))
  }

  const openBlueprint = (bp) => {
    setLastOpened({ author: bp.author, name: bp.name })
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }
  const editBlueprint = (bp) =>
    navigate(`/blueprints/${encodeURIComponent(bp.author)}/${encodeURIComponent(bp.name)}/edit`)
  const removeBlueprint = (bp) => {
    if (window.confirm(`¿Eliminar el blueprint "${bp.name}"?`)) {
      dispatch(deleteBlueprint({ author: bp.author, name: bp.name }))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <section className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Blueprints</h2>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              searchAuthor(authorInput)
            }}
          >
            <input
              className="input"
              placeholder="Author"
              aria-label="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Get blueprints
            </button>
          </form>
          {!!authors.length && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-400">Autores:</span>
              {authors.map((author) => (
                <button
                  key={author}
                  className={`btn btn-sm ${author === selectedAuthor ? 'btn-primary' : ''}`}
                  onClick={() => searchAuthor(author)}
                >
                  {author}
                </button>
              ))}
            </div>
          )}
          <RequestStatus
            request={fetchAllRequest}
            loadingText="Cargando catálogo..."
            onRetry={() => dispatch(fetchAllBlueprints())}
          />

          <RequestStatus
            request={byAuthorRequest}
            loadingText="Consultando planos..."
            onRetry={() => searchAuthor(authorInput)}
          />

          <RequestStatus
            request={blueprintRequest}
            loadingText="Cargando plano..."
            onRetry={() => lastOpened && dispatch(fetchBlueprint(lastOpened))}
          />
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-slate-100">
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          <RequestStatus
            request={removeRequest}
            errorPrefix="No se pudo eliminar (cambio revertido): "
          />
          {selectedAuthor && (
            <BlueprintList
              items={items}
              canEdit={isAuthenticated}
              onOpen={openBlueprint}
              onEdit={editBlueprint}
              onDelete={removeBlueprint}
            />
          )}
          <p className="pt-1 font-semibold text-slate-100">Total user points: {totalPoints}</p>
        </div>

        <TopBlueprints onOpen={openBlueprint} />
      </section>

      <section className="card space-y-4 self-start">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label htmlFor="current-blueprint" className="label">
              Current blueprint
            </label>
            <input
              id="current-blueprint"
              className="input"
              readOnly
              value={current?.name ?? ''}
              placeholder="—"
            />
          </div>
          {current && (
            <div className="flex gap-2">
              <Link
                className="btn"
                to={`/blueprints/${encodeURIComponent(current.author)}/${encodeURIComponent(current.name)}`}
              >
                Detalle
              </Link>
              {isAuthenticated && (
                <button className="btn" onClick={() => editBlueprint(current)}>
                  Editar
                </button>
              )}
            </div>
          )}
        </div>
        {current && <p className="text-sm text-slate-400">Autor: {current.author}</p>}
        <BlueprintCanvas id="blueprint-canvas" points={current?.points ?? []} />
      </section>
    </div>
  )
}
