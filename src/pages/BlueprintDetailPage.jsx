import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { fetchBlueprint } from '../features/blueprints/blueprintsSlice.js'
import {
  pointCount,
  selectBlueprint,
  selectRequest,
} from '../features/blueprints/blueprintsSelectors.js'
import { selectIsAuthenticated } from '../features/auth/authSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import RequestStatus from '../components/RequestStatus.jsx'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const bp = useSelector(selectBlueprint(author, name))
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const fetchRequest = useSelector(selectRequest('fetchBlueprint'))
  const updateRequest = useSelector(selectRequest('update'))

  const isLoaded = Boolean(bp)

  // Only fetch when missing: a GET racing an in-flight optimistic PUT could restore stale points.
  useEffect(() => {
    if (!isLoaded) dispatch(fetchBlueprint({ author, name }))
  }, [isLoaded, author, name, dispatch])

  return (
    <div className="card mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">{name}</h2>
          <p className="text-sm text-slate-400">
            Autor: {author} · Puntos: {bp ? pointCount(bp) : '—'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="btn" to="/">
            Volver
          </Link>
          {isAuthenticated && bp && (
            <Link
              className="btn btn-primary"
              to={`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}/edit`}
            >
              Editar
            </Link>
          )}
        </div>
      </div>
      <RequestStatus
        request={updateRequest}
        loadingText="Guardando cambios..."
        errorPrefix="No se pudo guardar (cambios revertidos): "
      />
      {!bp && <RequestStatus request={fetchRequest} loadingText="Cargando plano..." />}
      <BlueprintCanvas id="blueprint-detail-canvas" points={bp?.points ?? []} />
    </div>
  )
}
