import { useEffect, useRef, useState } from 'react'
import { CRAYON_COLORS } from '../lib/constants'

export default function CrayonCircle({ index, filled, onClick, size = 40, disabled }) {
  const canvasRef = useRef(null)
  const drawnRef = useRef(false)
  const [justChecked, setJustChecked] = useState(false)
  const prevFilled = useRef(filled)

  const color = CRAYON_COLORS[index % CRAYON_COLORS.length]

  // Detect when going from unchecked → checked
  useEffect(() => {
    if (filled && !prevFilled.current) {
      setJustChecked(true)
      const timer = setTimeout(() => setJustChecked(false), 600)
      prevFilled.current = filled
      return () => clearTimeout(timer)
    }
    prevFilled.current = filled
  }, [filled])

  useEffect(() => {
    if (!filled || !canvasRef.current) { drawnRef.current = false; return }
    if (drawnRef.current) return
    drawnRef.current = true

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const s = size * 2
    canvas.width = s; canvas.height = s
    ctx.clearRect(0, 0, s, s)

    const cx = s / 2, cy = s / 2, r = s / 2 - 4

    ctx.save()
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()

    for (let i = 0; i < 14; i++) {
      ctx.save()
      const angle = (Math.random() - 0.5) * 0.3
      ctx.translate(cx, cy); ctx.rotate(angle); ctx.translate(-cx, -cy)
      const y = cy - r + (i / 14) * r * 2
      const xOff = (Math.random() - 0.5) * 4
      ctx.strokeStyle = color
      ctx.lineWidth = 3 + Math.random() * 3
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.4 + Math.random() * 0.35
      ctx.beginPath()
      const startX = cx - r + xOff, endX = cx + r + xOff
      ctx.moveTo(startX, y)
      ctx.bezierCurveTo(
        startX + r * 0.5 + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 3,
        endX - r * 0.5 + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 3,
        endX, y
      )
      ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
    ctx.globalAlpha = 1
  }, [filled, index, size, color])

  const half = size / 2

  const handleClick = (e) => {
    if (disabled) return
    // Get click position for sparkle effect
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Dispatch custom event for sparkle
    if (!filled) {
      window.dispatchEvent(new CustomEvent('checkin-sparkle', {
        detail: { x: cx, y: cy, color, index }
      }))
    }
    onClick()
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: size, height: size, position: 'relative',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.15s',
        animation: justChecked ? 'stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.1)' }}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Base circle */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx={half} cy={half} r={half - 2}
          fill={filled ? 'transparent' : '#fff'}
          stroke={filled ? color : '#ddd'}
          strokeWidth={filled ? 1.8 : 1}
          strokeDasharray={filled ? 'none' : '2.5 2'}
        />
        {!filled && (
          <text x={half} y={half + 1} textAnchor="middle"
            dominantBaseline="central" fontSize="11" fill="#ccc"
            fontFamily="'Gaegu', sans-serif">
            {index + 1}
          </text>
        )}
      </svg>

      {/* Crayon fill */}
      {filled && (
        <canvas ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, pointerEvents: 'none' }} />
      )}

      {/* Number on filled */}
      {filled && (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <circle cx={half} cy={half} r={half - 2}
            fill="none" stroke="#444" strokeWidth={1.2} />
          <text x={half} y={half + 1} textAnchor="middle"
            dominantBaseline="central" fontSize="11" fill="#fff" fontWeight="700"
            fontFamily="'Gaegu', sans-serif"
            stroke="#333" strokeWidth="0.3">
            {index + 1}
          </text>
        </svg>
      )}
    </div>
  )
}
