import { useEffect, useRef } from 'react'

const GRID_STEP = 40
const BACKGROUND = '#020617'
const GRID_COLOR = 'rgba(148,163,184,0.12)'
const SEGMENT_COLOR = '#7dd3fc'
const POINT_COLOR = '#fbbf24'

function draw(canvas, points) {
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 1
  for (let x = 0; x < canvas.width; x += GRID_STEP) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y < canvas.height; y += GRID_STEP) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  if (points.length > 1) {
    ctx.strokeStyle = SEGMENT_COLOR
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (const p of points.slice(1)) ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  ctx.fillStyle = POINT_COLOR
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * Draws a blueprint as consecutive segments with a marker on every point.
 * When `onAddPoint` is given the canvas becomes interactive: each click adds a point.
 */
export default function BlueprintCanvas({
  id = 'blueprint-canvas',
  points = [],
  width = 520,
  height = 360,
  onAddPoint,
}) {
  const ref = useRef(null)
  const interactive = typeof onAddPoint === 'function'

  useEffect(() => {
    draw(ref.current, points)
  }, [points])

  const handleClick = (event) => {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    // The canvas may be scaled by CSS; map the click back to canvas pixels.
    const scaleX = rect.width ? canvas.width / rect.width : 1
    const scaleY = rect.height ? canvas.height / rect.height : 1
    onAddPoint({
      x: Math.round((event.clientX - rect.left) * scaleX),
      y: Math.round((event.clientY - rect.top) * scaleY),
    })
  }

  return (
    <canvas
      id={id}
      ref={ref}
      width={width}
      height={height}
      aria-label={
        interactive ? 'Lienzo de dibujo: haz click para agregar puntos' : 'Lienzo del plano'
      }
      onClick={interactive ? handleClick : undefined}
      style={{ maxWidth: width }}
      className={`block w-full rounded-xl border border-slate-700 bg-slate-950 ${
        interactive ? 'cursor-crosshair' : ''
      }`}
    />
  )
}
