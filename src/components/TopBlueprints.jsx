import { useSelector } from 'react-redux'
import { pointCount, selectTop5ByPoints } from '../features/blueprints/blueprintsSelectors.js'

/** Top-5 blueprints by number of points (memoized selector). */
export default function TopBlueprints({ onOpen }) {
  const top = useSelector(selectTop5ByPoints)

  return (
    <div className="card">
      <h3 className="mb-3 text-lg font-semibold text-slate-100">Top 5 por número de puntos</h3>
      {!top.length ? (
        <p className="text-sm text-slate-400">Aún no hay blueprints cargados.</p>
      ) : (
        <ol className="space-y-2">
          {top.map((bp, index) => (
            <li key={`${bp.author}/${bp.name}`} className="flex items-center gap-3 text-sm">
              <span className="flex size-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-amber-300">
                {index + 1}
              </span>
              <button
                className="cursor-pointer text-left font-medium text-slate-100 hover:text-sky-300"
                onClick={() => onOpen(bp)}
              >
                {bp.name}
              </button>
              <span className="text-slate-500">{bp.author}</span>
              <span className="ml-auto tabular-nums text-slate-300">{pointCount(bp)} pts</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
