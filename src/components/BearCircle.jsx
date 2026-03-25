import { useEffect, useRef, useState } from 'react'
import { CRAYON_COLORS } from '../lib/constants'

/*
  Uses the actual bear.png image.
  When filled: crayon color is drawn ONLY inside the bear's face circle
  (clipped to an oval matching the head), then bear.png overlays on top
  with multiply blend so the black outlines stay and color fills the white.
*/

export default function BearCircle({ index, filled, onClick, size = 52, disabled }) {
  const canvasRef = useRef(null)
  const drawnRef = useRef(false)
  const [justChecked, setJustChecked] = useState(false)
  const prevFilled = useRef(filled)

  const color = CRAYON_COLORS[index % CRAYON_COLORS.length]

  useEffect(() => {
    if (filled && !prevFilled.current) {
      setJustChecked(true)
      const timer = setTimeout(() => setJustChecked(false), 600)
      prevFilled.current = filled
      return () => clearTimeout(timer)
    }
    prevFilled.current = filled
  }, [filled])

  // Draw crayon color clipped to bear face oval
  useEffect(() => {
    if (!filled || !canvasRef.current) { drawnRef.current = false; return }
    if (drawnRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = size * 2
    const h = size * 2
    canvas.width = w
    canvas.height = h
    ctx.clearRect(0, 0, w, h)

    // Fill white base first (needed for multiply blend)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    // Clip to oval matching the bear's face shape
    // The bear head in bear.png is roughly centered, slightly lower,
    // occupying ~78% width and ~72% height of the image
    const cx = w * 0.50
    const cy = h * 0.53
    const rx = w * 0.39  // horizontal radius
    const ry = h * 0.36  // vertical radius

    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.clip()

    // Crayon-style colored pencil strokes inside the oval
    const top = cy - ry
    const bottom = cy + ry
    for (let i = 0; i < 20; i++) {
      ctx.save()
      const angle = (Math.random() - 0.5) * 0.15
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.translate(-cx, -cy)

      const y = top + (i / 20) * (bottom - top)
      ctx.strokeStyle = color
      ctx.lineWidth = 4 + Math.random() * 4
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.45 + Math.random() * 0.4

      // Vary stroke start/end to feel hand-drawn
      const leftEdge = cx - rx * Math.sqrt(1 - ((y - cy) / ry) ** 2)
      const rightEdge = cx + rx * Math.sqrt(1 - ((y - cy) / ry) ** 2)

      ctx.beginPath()
      ctx.moveTo(leftEdge + (Math.random() - 0.5) * 4, y)
      ctx.bezierCurveTo(
        leftEdge + (rightEdge - leftEdge) * 0.3 + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 4,
        leftEdge + (rightEdge - leftEdge) * 0.7 + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 4,
        rightEdge + (Math.random() - 0.5) * 4, y
      )
      ctx.stroke()
      ctx.restore()
    }

    ctx.restore()
    drawnRef.current = true
  }, [filled, index, size, color])

  const handleClick = (e) => {
    if (disabled) return
    if (!filled) {
      const rect = e.currentTarget.getBoundingClientRect()
      window.dispatchEvent(new CustomEvent('checkin-sparkle', {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color, index }
      }))
    }
    onClick()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {/* Number above */}
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: filled ? '#222' : '#bbb',
        fontFamily: "'Gaegu', sans-serif",
        marginBottom: 1,
        transition: 'color 0.3s',
      }}>
        {index + 1}
      </span>

      <div
        onClick={handleClick}
        style={{
          width: size, height: size, position: 'relative',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'transform 0.15s',
          animation: justChecked ? 'stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          isolation: 'isolate',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Layer 1: Bear image */}
        <img
          src="/bear.png"
          alt=""
          draggable={false}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: size, height: size,
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: filled ? 1 : 0.22,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Layer 2: Crayon color (oval-clipped) with multiply blend */}
        {filled && (
          <canvas ref={canvasRef} style={{
            position: 'absolute', top: 0, left: 0,
            width: size, height: size,
            pointerEvents: 'none',
            zIndex: 1,
            mixBlendMode: 'multiply',
          }} />
        )}
      </div>
    </div>
  )
}
