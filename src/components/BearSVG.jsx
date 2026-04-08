import { useEffect, useRef, useState, useCallback } from 'react'
import { CRAYON_COLORS } from '../lib/skins'

/*
  Bear component using damgom PNG images.
  Crayon strokes clipped to multiple ellipses per skin.
  mix-blend-mode: multiply keeps black outlines, colors white areas.
  Colors are randomly picked per bear (seeded by index).
  Animation: diagonal crayon strokes drawn one by one on check-in.
*/

const SKIN_IMAGES = {
  stripe: '/damgom.png',
  simple: '/damgom_cry.png',
  shiver: '/damgom_cry_shiver.png',
  chiikawa: '/chiikawa.png',
}

// Image scale per skin (character fills different % of the PNG)
const SKIN_SCALE = {
  stripe: 1,
  simple: 1.35,
  shiver: 1.25,
  chiikawa: 1.3,
}

const SKIN_CLIP = {
  stripe: [
    { cx: 0.50, cy: 0.50, rx: 0.40, ry: 0.38 },
  ],
  simple: [
    { cx: 0.50, cy: 0.38, rx: 0.38, ry: 0.32 },
    { cx: 0.50, cy: 0.68, rx: 0.32, ry: 0.25 },
  ],
  shiver: [
    { cx: 0.50, cy: 0.35, rx: 0.36, ry: 0.30 },
    { cx: 0.50, cy: 0.65, rx: 0.28, ry: 0.28 },
  ],
  chiikawa: [
    { cx: 0.50, cy: 0.48, rx: 0.38, ry: 0.40 },
  ],
}

// Seeded PRNG
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Each bear gets a unique color by index (never repeats for 30 bears)
function pickColor(index) {
  return CRAYON_COLORS[index % CRAYON_COLORS.length]
}

// Generate diagonal crayon strokes for all clip regions
function generateStrokes(regions, w, h, count, seed) {
  const rng = mulberry32(seed)
  const strokes = []

  for (const r of regions) {
    const cx = r.cx * w, cy = r.cy * h
    const rx = r.rx * w, ry = r.ry * h
    const top = cy - ry, bottom = cy + ry

    for (let i = 0; i < count; i++) {
      const y = top + (i / count) * (bottom - top)
      const t = (y - cy) / ry
      if (Math.abs(t) > 0.97) continue
      const halfW = rx * Math.sqrt(1 - t * t)

      // Diagonal offset — strokes go from top-left to bottom-right
      const diagOffset = (y - top) * 0.3
      const leftEdge = cx - halfW + diagOffset + (rng() - 0.5) * 4
      const rightEdge = cx + halfW + diagOffset + (rng() - 0.5) * 4

      const cp1x = leftEdge + (rightEdge - leftEdge) * 0.3 + (rng() - 0.5) * 6
      const cp1y = y + (rng() - 0.5) * 4
      const cp2x = leftEdge + (rightEdge - leftEdge) * 0.7 + (rng() - 0.5) * 6
      const cp2y = y + (rng() - 0.5) * 4

      // Diagonal angle for crayon feel
      const angle = 0.12 + (rng() - 0.5) * 0.08
      const lineWidth = 4 + rng() * 5
      const alpha = 0.35 + rng() * 0.4

      strokes.push({ y, leftEdge, rightEdge, cp1x, cp1y, cp2x, cp2y, angle, lineWidth, alpha, cx, cy })
    }
  }

  // Sort by diagonal position (top-left to bottom-right) for animation order
  strokes.sort((a, b) => (a.y + a.leftEdge * 0.3) - (b.y + b.leftEdge * 0.3))
  return strokes
}

function drawStrokesPartial(ctx, strokes, color, count) {
  for (let i = 0; i < count; i++) {
    const s = strokes[i]
    if (!s) continue
    ctx.save()
    ctx.translate(s.cx, s.cy)
    ctx.rotate(s.angle)
    ctx.translate(-s.cx, -s.cy)
    ctx.strokeStyle = color
    ctx.lineWidth = s.lineWidth
    ctx.lineCap = 'round'
    ctx.globalAlpha = s.alpha
    ctx.beginPath()
    ctx.moveTo(s.leftEdge, s.y)
    ctx.bezierCurveTo(s.cp1x, s.cp1y, s.cp2x, s.cp2y, s.rightEdge, s.y)
    ctx.stroke()
    ctx.restore()
  }
}

function applyClipPath(ctx, regions, w, h) {
  ctx.beginPath()
  for (const r of regions) {
    ctx.ellipse(r.cx * w, r.cy * h, r.rx * w, r.ry * h, 0, 0, Math.PI * 2)
  }
  ctx.clip()
}

function drawFull(canvas, regions, strokes, color, w, h) {
  const ctx = canvas.getContext('2d')
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  applyClipPath(ctx, regions, w, h)
  drawStrokesPartial(ctx, strokes, color, strokes.length)
  ctx.restore()
}

export default function BearSVG({
  index,
  filled,
  onClick,
  size = 52,
  disabled,
  isToday,
  skinId = 'stripe',
  t,
}) {
  const canvasRef = useRef(null)
  const [justChecked, setJustChecked] = useState(false)
  const prevFilled = useRef(filled)
  const animatingRef = useRef(false)
  const strokesCacheRef = useRef(null)

  // Random color per bear (seeded by index)
  const color = pickColor(index)
  const imgSrc = SKIN_IMAGES[skinId] || SKIN_IMAGES.stripe
  const regions = SKIN_CLIP[skinId] || SKIN_CLIP.stripe
  const imgScale = SKIN_SCALE[skinId] || 1

  const scale = 2
  const STROKES_PER_REGION = 40

  const getStrokes = useCallback(() => {
    if (!strokesCacheRef.current || strokesCacheRef.current.skinId !== skinId) {
      const w = size * scale
      const h = size * scale
      strokesCacheRef.current = {
        skinId,
        strokes: generateStrokes(regions, w, h, STROKES_PER_REGION, index * 7919 + 42),
        w, h,
      }
    }
    return strokesCacheRef.current
  }, [size, regions, skinId, index])

  // Animate diagonal coloring on first check-in
  useEffect(() => {
    if (filled && !prevFilled.current) {
      setJustChecked(true)
      animatingRef.current = true
      const timer = setTimeout(() => setJustChecked(false), 1200)
      prevFilled.current = filled

      const canvas = canvasRef.current
      if (!canvas) return () => clearTimeout(timer)
      const ctx = canvas.getContext('2d')
      const { strokes, w, h } = getStrokes()
      canvas.width = w
      canvas.height = h

      let frame = 0
      const totalFrames = strokes.length
      // ~1 second total
      const intervalMs = Math.max(Math.floor(1000 / totalFrames), 16)
      const interval = setInterval(() => {
        frame++
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.save()
        applyClipPath(ctx, regions, w, h)
        drawStrokesPartial(ctx, strokes, color, frame)
        ctx.restore()
        if (frame >= totalFrames) {
          clearInterval(interval)
          animatingRef.current = false
        }
      }, intervalMs)

      return () => { clearTimeout(timer); clearInterval(interval) }
    }
    prevFilled.current = filled
  }, [filled, color, getStrokes, regions])

  // Draw full strokes (non-animated, for already-filled bears)
  useEffect(() => {
    if (!filled || !canvasRef.current || animatingRef.current) return
    const { strokes, w, h } = getStrokes()
    drawFull(canvasRef.current, regions, strokes, color, w, h)
  }, [filled, color, getStrokes, skinId, regions])

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
      <span style={{
        fontSize: isToday ? 10 : 11, fontWeight: 700,
        color: isToday ? '#fff' : (filled ? '#222' : '#bbb'),
        fontFamily: "'JejuGothic', sans-serif",
        marginBottom: 1,
        transition: 'color 0.3s',
        ...(isToday ? {
          background: '#222', padding: '0 5px', borderRadius: 2,
        } : {}),
      }}>
        {isToday ? (t?.today || 'today') : (index + 1)}
      </span>

      <div
        onClick={handleClick}
        style={{
          width: size, height: size, position: 'relative',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'transform 0.15s',
          animation: justChecked ? 'stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                   : (isToday && !filled) ? 'pulseGlow 2s ease infinite' : 'none',
          isolation: 'isolate',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img
          src={imgSrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: `${(1 - imgScale) / 2 * 100}%`,
            left: `${(1 - imgScale) / 2 * 100}%`,
            width: `${imgScale * 100}%`,
            height: `${imgScale * 100}%`,
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: filled ? 1 : 0.25,
            transition: 'opacity 0.3s',
          }}
        />

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
