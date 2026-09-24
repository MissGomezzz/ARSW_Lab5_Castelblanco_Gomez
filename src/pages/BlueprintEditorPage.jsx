import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createBlueprint,
  fetchBlueprint,
  updateBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import {
  selectBlueprint,
  selectRequest,
  selectSelectedAuthor,
} from '../features/blueprints/blueprintsSelectors.js'
import { selectUsername } from '../features/auth/authSlice.js'
import BlueprintForm from '../components/BlueprintForm.jsx'
import RequestStatus from '../components/RequestStatus.jsx'

const detailPath = ({ author, name }) =>
  `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`

/** Protected page to create (mode="create") or edit (mode="edit") a blueprint by drawing it. */
export default function BlueprintEditorPage({ mode }) {
  const isEdit = mode === 'edit'
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const existing = useSelector(selectBlueprint(author, name))
  const selectedAuthor = useSelector(selectSelectedAuthor)
  const username = useSelector(selectUsername)
  const createRequest = useSelector(selectRequest('create'))
  const fetchRequest = useSelector(selectRequest('fetchBlueprint'))

  useEffect(() => {
    if (isEdit && !existing) dispatch(fetchBlueprint({ author, name }))
  }, [isEdit, existing, author, name, dispatch])

  const handleSubmit = async (blueprint) => {
    if (isEdit) {
      // Optimistic: the store changes immediately and reverts itself if the PUT fails.
      dispatch(updateBlueprint(blueprint))
      navigate(detailPath(blueprint))
      return
    }
    try {
      await dispatch(createBlueprint(blueprint)).unwrap()
      navigate(detailPath(blueprint))
    } catch {
      // The error is already in the store and rendered by <RequestStatus>.
    }
  }

  return (
    <div className="card mx-auto max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold text-slate-100">
        {isEdit ? `Editar blueprint: ${name}` : 'Nuevo blueprint'}
      </h2>
      {isEdit && !existing ? (
        <RequestStatus request={fetchRequest} loadingText="Cargando plano..." />
      ) : (
        <>
          <BlueprintForm
            key={isEdit ? `${author}/${name}` : 'new'}
            initial={
              isEdit ? existing : { author: selectedAuthor || username || '', name: '', points: [] }
            }
            lockIdentity={isEdit}
            submitting={createRequest.status === 'loading'}
            onSubmit={handleSubmit}
          />
          {!isEdit && <RequestStatus request={createRequest} loadingText="Creando blueprint..." />}
        </>
      )}
    </div>
  )
}
