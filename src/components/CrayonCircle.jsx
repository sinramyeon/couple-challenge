import { useEffect, useRef } from 'react'
import { PASTEL_FILLS, CRAYON_COLORS } from '../lib/constants'

export default function CrayonCircle({ index, filled, onClick, size = 42, disabled }) {
  const canvasRef = useRef(null)
  const drawnRef = useRef(false)

  useEffect(() => {
    if (!filled || !canvasRef.current) { drawnRef.current = false; return }
    if (drawnRef.current) return
    drawnRef.current = true

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const s = size * 2
    canvas.width = s; canvas.height = s
    ctx.clearRect(0, 0, s, s)
    const color = CRAYON_COLORS[index % CRAYON_COLORS.length]
    const cx = s / 2, cy = s / 2, r = s / 2 - 4

    ctx.save()
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()

    for (let i = 0; i < 18; i++) {
      ctx.save()
      const angle = (Math.random() - 0.5) * 0.4
      ctx.translate(cx, cy); ctx.rotate(angle); ctx.translate(-cx, -cy)
      const y = cy - r + (i / 18) * r * 2
      const xOff = (Math.random() - 0.5) * 6
      ctx.strokeStyle = color
      ctx.lineWidth = 3 + Math.random() * 3
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.5 + Math.random() * 0.4
      ctx.beginPath()
      const startX = cx - r + xOff, endX = cx + r + xOff
      ctx.moveTo(startX, y)
      ctx.bezierCurveTo(
        startX + r * 0.5 + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 4,
        endX - r * 0.5 + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 4,
        endX, y
      )
      ctx.stroke()
      ctx.restore()
    }

    ctx.restore()
    ctx.globalAlpha = 1
  }, [filled, index, size])

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: size, height: size, position: 'relative',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.12)' }}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 2}
          fill={filled ? 'transparent' : PASTEL_FILLS[index % PASTEL_FILLS.length] + '55'}
          stroke={filled ? CRAYON_COLORS[index % CRAYON_COLORS.length] + '88' : '#ccc8'}
          strokeWidth={filled ? 2 : 1.2}
          strokeDasharray={filled ? 'none' : '3 2'}
        />
        {!filled && (
          <text x={size / 2} y={size / 2 + 1} textAnchor="middle"
            dominantBaseline="central" fontSize="11" fill="#bbb" fontFamily="sans-serif">
            {index + 1}
          </text>
        )}
      </svg>
      {filled && (
        <canvas ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, pointerEvents: 'none' }} />
      )}
      {filled && (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <text x={size / 2} y={size / 2 + 1} textAnchor="middle"
            dominantBaseline="central" fontSize="11" fill="#fff" fontWeight="600" fontFamily="sans-serif">
            {index + 1}
          </text>
        </svg>
      )}
    </div>
  )
}
