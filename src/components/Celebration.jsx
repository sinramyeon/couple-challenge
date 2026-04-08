import { useEffect, useRef } from 'react'
import { CRAYON_COLORS } from '../lib/constants'

export function Confetti({ show }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    if (!show || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = CRAYON_COLORS.slice(0, 10)
    const particles = []
    for (let i = 0; i < 250; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        opacity: 1,
      })
    }

    let frame = 0
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      particles.forEach(p => {
        p.x += p.vx; p.vy += 0.04; p.y += p.vy
        p.rotation += p.rotSpeed
        if (frame > 150) p.opacity = Math.max(0, p.opacity - 0.006)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill()
        }
        ctx.restore()
      })
      if (frame < 350 && particles.some(p => p.opacity > 0)) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animate()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [show])

  if (!show) return null
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 9999,
    }} />
  )
}

export function CelebrationModal({ name, onClose, onRestart, bothComplete, t }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9998, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 0, padding: '40px 32px',
          maxWidth: 380, width: '100%', textAlign: 'center',
          animation: 'celebBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '2px solid #222',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', margin: '0 0 12px' }}>
          {t.celebTitle}
        </h2>
        <p style={{ fontSize: 18, color: '#555', lineHeight: 1.6, margin: '0 0 4px' }}>
          <strong style={{ color: '#222' }}>{name}</strong>
        </p>
        <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px', color: '#222' }}>
          {t.celebCompleted}
        </p>
        <div style={{
          background: '#fafafa', padding: '16px 20px', marginBottom: 20,
          border: '1px dashed #ddd',
        }}>
          <p style={{ fontSize: 15, color: '#666', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {t.celebMsg}
          </p>
        </div>
        {/* Colorful sticker dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 20 }}>
          {CRAYON_COLORS.slice(0, 8).map((c, i) => (
            <div key={i} style={{
              width: 16, height: 16, borderRadius: 50,
              background: c, border: '1px solid #444',
              animation: 'sparkle 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '12px 32px', borderRadius: 0, cursor: 'pointer',
            background: '#222', border: '2px solid #222',
            color: '#fff', fontSize: 16, fontWeight: 700,
            fontFamily: "'JejuGothic', sans-serif",
            transition: 'transform 0.15s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {t.celebClose}
        </button>
        {bothComplete && onRestart && (
          <button
            onClick={onRestart}
            style={{
              marginTop: 10, padding: '10px 24px', cursor: 'pointer',
              background: '#fff', border: '2px solid #222',
              color: '#222', fontSize: 14, fontWeight: 700,
              fontFamily: "'JejuGothic', sans-serif",
            }}
          >
            {t.restartNewGoal || '새로운 목표로 다시 시작!'}
          </button>
        )}
      </div>
    </div>
  )
}
