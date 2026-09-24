/** Shows the loading/error state of one thunk request. */
export default function RequestStatus({ request, loadingText = 'Cargando...', errorPrefix = '' }) {
  if (request.status === 'loading') {
    return (
      <p role="status" className="text-sm text-sky-300">
        {loadingText}
      </p>
    )
  }
  if (request.status === 'failed') {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
      >
        {errorPrefix}
        {request.error}
      </p>
    )
  }
  return null
}
