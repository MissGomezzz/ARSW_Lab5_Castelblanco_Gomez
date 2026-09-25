/** Shows the loading/error state of one thunk request. */
export default function RequestStatus({ request, loadingText = 'Cargando...', errorPrefix = '', onRetry }) {
  if (request.status === 'loading') {
    return (
      <p role="status" className="text-sm text-sky-300">
        {loadingText}
      </p>
    )
  }
  if (request.status === 'failed') {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
      >
        <p>{errorPrefix}{request.error}</p>
        {onRetry && (
          <button type="button" className="btn btn-sm mt-2" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }
  return null
}
