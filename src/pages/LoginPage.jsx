import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, selectAuthRequest } from '../features/auth/authSlice.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector(selectAuthRequest)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname ?? '/'

  const submit = async (event) => {
    event.preventDefault()
    try {
      await dispatch(login({ username, password })).unwrap()
      navigate(from, { replace: true })
    } catch {
      // The error is already in the store and rendered below.
    }
  }

  return (
    <form className="card mx-auto max-w-md space-y-4" onSubmit={submit}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Login</h2>
        <p className="text-sm text-slate-400">
          Usuario de prueba: <code className="text-sky-300">student / student123</code>
        </p>
      </div>
      <div>
        <label htmlFor="username" className="label">
          Usuario
        </label>
        <input
          id="username"
          className="input"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="input"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
