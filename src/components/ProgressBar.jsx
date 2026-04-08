import { CRAYON_COLORS } from '../lib/skins'
import { useEffect, useRef } from 'react'

const MILESTONE_MARKS = [5, 10, 15, 20, 25, 30]

export default function ProgressBar({ filled, total = 30, t }) {
  const progress = filled / total
  const canvasRef = useRef(null)
  const drawnCountRef = useRef(0)

  // Draw crayon-style fill
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.parentElement.offsetWidth
    const h = 18
    canvas.width = w * 2
    canvas.height = h * 2
    const ctx = canvas.getContext('2d')
    ctx.scale(2, 2)
    ctx.clearRect(0, 0, w, h)

    if (filled === 0) return

    const fillW = w * progress

    // Crayon texture fill
    const segmentW = w / total
    for (let i = 0; i < filled; i++) {
      const color = CRAYON_COLORS[i % CRAYON_COLORS.length]
      const sx = i * segmentW
      ctx.save()
      ctx.beginPath()
      ctx.rect(sx, 0, segmentW + 0.5, h)
      ctx.clip()

      // Colored pencil strokes
      for (let s = 0; s < 4; s++) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2 + Math.random() * 3
        ctx.lineCap = 'round'
        ctx.globalAlpha = 0.4 + Math.random() * 0.35
        const y = 2 + (s / 4) * (h - 4)
        ctx.beginPath()
        ctx.moveTo(sx, y + (Math.random() - 0.5) * 2)
        ctx.lineTo(sx + segmentW, y + (Math.random() - 0.5) * 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    drawnCountRef.current = filled
  }, [filled, total, progress])

  return (
    <div style={{ marginBottom: 12, position: 'relative' }}>
      {/* Track */}
      <div style={{
        position: 'relative', height: 18,
        border: '1.5px solid #222', background: '#fff',
        overflow: 'hidden',
      }}>
        <canvas ref={canvasRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        }} />
      </div>

      {/* Milestone markers */}
      <div style={{ position: 'relative', height: 14, marginTop: 2 }}>
        {MILESTONE_MARKS.map(m => {
          const pos = (m / total) * 100
          const reached = filled >= m
          return (
            <div key={m} style={{
              position: 'absolute', left: `${pos}%`, transform: 'translateX(-50%)',
              fontSize: 9, color: reached ? '#222' : '#ccc',
              fontWeight: reached ? 700 : 400,
              transition: 'all 0.3s',
            }}>
              {m}
            </div>
          )
        })}
      </div>
    </div>
  )
}
