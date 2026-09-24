import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Route, Routes } from 'react-router-dom'
import BlueprintsPage from './pages/BlueprintsPage.jsx'
import BlueprintDetailPage from './pages/BlueprintDetailPage.jsx'
import BlueprintEditorPage from './pages/BlueprintEditorPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { logout, selectIsAuthenticated, selectUsername } from './features/auth/authSlice.js'
import { USE_MOCK } from './services/blueprintsService.js'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm transition ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-100'
  }`

export default function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const username = useSelector(selectUsername)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            ECI - Laboratorio de Blueprints en React
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              USE_MOCK ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
            }`}
          >
            {USE_MOCK ? 'Servicio: apimock' : 'Servicio: apiclient (API REST)'}
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Blueprints
          </NavLink>
          <NavLink to="/blueprints/new" className={navLinkClass}>
            Nuevo blueprint
          </NavLink>
          {isAuthenticated ? (
            <>
              <span className="px-3 text-sm text-slate-400">{username}</span>
              <button className="btn btn-sm" onClick={() => dispatch(logout())}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<BlueprintsPage />} />
        <Route
          path="/blueprints/new"
          element={
            <PrivateRoute>
              <BlueprintEditorPage mode="create" />
            </PrivateRoute>
          }
        />
        <Route path="/blueprints/:author/:name" element={<BlueprintDetailPage />} />
        <Route
          path="/blueprints/:author/:name/edit"
          element={
            <PrivateRoute>
              <BlueprintEditorPage mode="edit" />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
