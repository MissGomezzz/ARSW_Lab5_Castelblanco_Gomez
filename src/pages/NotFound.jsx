import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md space-y-3 text-center">
      <p className="text-lg text-slate-100">404: Página no encontrada</p>
      <Link className="btn" to="/">
        Volver al inicio
      </Link>
    </div>
  )
}
