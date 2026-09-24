import { pointCount } from '../features/blueprints/blueprintsSelectors.js'

/** Table of an author's blueprints: name, number of points and actions. */
export default function BlueprintList({ items = [], canEdit = false, onOpen, onEdit, onDelete }) {
  if (!items.length) return <p className="text-sm text-slate-400">Sin resultados.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-left text-slate-400">
            <th className="py-2 pr-2 font-medium">Blueprint name</th>
            <th className="px-2 py-2 text-right font-medium">Number of points</th>
            <th className="py-2 pl-2">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((bp) => (
            <tr key={bp.name} className="border-b border-slate-800 last:border-0">
              <td className="py-2 pr-2 font-medium text-slate-100">{bp.name}</td>
              <td className="px-2 py-2 text-right tabular-nums">{pointCount(bp)}</td>
              <td className="py-2 pl-2">
                <div className="flex justify-end gap-2">
                  <button className="btn btn-sm btn-primary" onClick={() => onOpen(bp)}>
                    Open
                  </button>
                  {canEdit && (
                    <>
                      <button className="btn btn-sm" onClick={() => onEdit(bp)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(bp)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
