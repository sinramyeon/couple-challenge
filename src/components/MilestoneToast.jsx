import { useState, useEffect, useRef } from 'react'
import { CRAYON_COLORS } from '../lib/skins'

/* ─── Mini confetti burst for milestone toasts ─── */
function MiniBurst({ color }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 200, h = 120
    canvas.width = w * 2; canvas.height = h * 2
    ctx.scale(2, 2)

    const particles = []
    const colors = CRAYON_COLORS.slice(0, 8)
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5
      const speed = 1.5 + Math.random() * 2.5
      particles.push({
        x: w / 2, y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        shape: Math.random() > 0.4 ? 'circle' : 'star',
      })
    }

    let frame = 0
    function animate() {
      ctx.clearRect(0, 0, w, h)
      frame++
      particles.forEach(p => {
        p.x += p.vx
        p.vy += 0.06
        p.y += p.vy
        p.life -= 0.018
        if (p.life <= 0) return
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
      if (frame < 60 && particles.some(p => p.life > 0)) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [color])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
      width: 200, height: 120, pointerEvents: 'none',
    }} />
  )
}

function drawStar(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
    const innerAngle = angle + Math.PI / 5
    ctx.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4)
  }
  ctx.closePath()
  ctx.fill()
}

/* ─── Toast notification component ─── */
export default function MilestoneToast({ milestone, onDone }) {
  const [phase, setPhase] = useState('enter') // enter -> show -> exit
  const [showBurst, setShowBurst] = useState(false)

  useEffect(() => {
    if (!milestone) return
    setPhase('enter')
    setShowBurst(true)

    const showTimer = setTimeout(() => setPhase('show'), 50)
    const exitTimer = setTimeout(() => setPhase('exit'), 2800)
    const doneTimer = setTimeout(() => onDone(), 3400)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [milestone, onDone])

  if (!milestone) return null

  const { icon, text, sub } = milestone

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9990,
      display: 'flex', justifyContent: 'center', padding: '20px 16px',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        background: '#fff',
        border: '2px solid #222',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        maxWidth: 340,
        transform: phase === 'show' ? 'translateY(0) scale(1)' :
                   phase === 'enter' ? 'translateY(-30px) scale(0.8)' :
                   'translateY(-20px) scale(0.9)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '3px 3px 0px #222',
      }}>
        {showBurst && <MiniBurst color={CRAYON_COLORS[0]} />}
        <span style={{
          fontSize: 32,
          animation: 'toastBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>{icon}</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>{text}</div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 1 }}>{sub}</div>
        </div>
      </div>
    </div>
  )
}

/* ─── Tiny check-in pop (shows near the circle) ─── */
export function CheckInPop({ show, x, y, color }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 700)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', left: x - 20, top: y - 40,
      pointerEvents: 'none', zIndex: 9980,
      animation: 'popUp 0.7s ease-out forwards',
    }}>
      {/* sparkle particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 6
        const dist = 14 + Math.random() * 8
        return (
          <div key={i} style={{
            position: 'absolute',
            left: 20 + Math.cos(angle) * dist,
            top: 20 + Math.sin(angle) * dist,
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: i % 2 === 0 ? '50%' : '1px',
            background: CRAYON_COLORS[(i * 3) % CRAYON_COLORS.length],
            animation: `sparkleOut 0.6s ease-out forwards`,
            animationDelay: `${i * 0.04}s`,
            transform: i % 2 === 0 ? 'rotate(0deg)' : 'rotate(45deg)',
          }} />
        )
      })}
    </div>
  )
}
