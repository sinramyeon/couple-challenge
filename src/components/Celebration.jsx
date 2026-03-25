import { useEffect, useRef } from 'react'
import BunnyFace from './BunnyFace'

export function Confetti({ show }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    if (!show || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#C4A0E0','#87BEE0','#E0A087','#87E0A0','#E0D587','#E087BE','#FFD700','#FF69B4','#87CEEB','#98FB98']
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

export function CelebrationModal({ name, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9998, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 28, padding: '44px 36px',
          maxWidth: 400, width: '100%', textAlign: 'center',
          animation: 'celebBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 12, animation: 'megaFloat 2s ease-in-out infinite' }}>
          🎉
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ animation: 'megaFloat 2.5s ease-in-out infinite 0.2s' }}>
            <BunnyFace mood="cheer" size={52} />
          </div>
          <div style={{ animation: 'megaFloat 2.5s ease-in-out infinite 0.5s' }}>
            <BunnyFace mood="cheer" size={52} />
          </div>
        </div>
        <h2 style={{
          fontSize: 28, fontWeight: 800,
          background: 'linear-gradient(135deg, #C4A0E0, #87BEE0, #E0A087, #87E0A0)',
          backgroundSize: '200% 200%', animation: 'rainbow 3s linear infinite',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0 0 12px',
        }}>
          대단해요!! 🌟🏆🌟
        </h2>
        <p style={{ fontSize: 18, color: '#666', lineHeight: 1.6, margin: '0 0 6px' }}>
          <strong style={{ color: '#8B6AAE', fontSize: 20 }}>{name}</strong>님이
        </p>
        <p style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            30일 챌린지 완주!
          </span> 🏅
        </p>
        <div style={{
          background: 'linear-gradient(135deg, #f8f0ff, #f0f8ff, #fff5f0)',
          borderRadius: 20, padding: '20px 24px', marginBottom: 24,
          border: '1.5px solid #e8ddf0',
        }}>
          <p style={{ fontSize: 15, color: '#777', margin: 0, lineHeight: 1.7 }}>
            매일매일 꾸준히 해낸 당신, 정말 대단해요!<br/>
            30일의 노력이 만든 이 결과, 자랑스러워해도 돼요.<br/>
            이 습관이 앞으로도 쭉 이어지길 응원할게요 💜
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['⭐','🌈','🎊','✨','🏅','🎆','💫','🥳','🪅','🎇'].map((e, i) => (
            <span key={i} style={{
              fontSize: 28, animation: 'sparkle 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`, display: 'inline-block',
            }}>{e}</span>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '14px 36px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #C4A0E0, #87BEE0, #E0A087)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(196,160,224,0.3)', transition: 'transform 0.15s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          계속 응원하기 💪
        </button>
      </div>
    </div>
  )
}
