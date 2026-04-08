import { useState } from 'react'
import { SKIN_LIST } from '../lib/skins'
import BearSVG from './BearSVG'

/*
  Skin picker — level up = pick a new skin to unlock.
  unlockedSkins: array of skin IDs the user has unlocked (e.g. ['stripe', 'chiikawa'])
  unlockSlots: how many total skins the user can have (= coupleLevel, capped at SKIN_LIST.length)
  canUnlock: unlockSlots > unlockedSkins.length (user has a pending unlock to use)
*/

export default function SkinPicker({ currentSkin, onSelect, onUnlock, onClose, lang, unlockedSkins, coupleLevel }) {
  const [hoveredSkin, setHoveredSkin] = useState(null)
  const isKo = lang === 'ko'
  const unlockSlots = Math.min(coupleLevel, SKIN_LIST.length)
  const canUnlock = unlockSlots > unlockedSkins.length

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.2s ease',
      }} />

      <div style={{
        position: 'fixed', zIndex: 201,
        bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTop: '2.5px solid #222',
        padding: '24px 20px 32px',
        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxHeight: '70vh', overflowY: 'auto',
      }}>
        <div style={{
          width: 40, height: 4, background: '#ccc', borderRadius: 2,
          margin: '0 auto 16px',
        }} />

        <h3 style={{
          fontSize: 22, fontWeight: 700, color: '#222',
          fontFamily: "'JejuGothic', sans-serif",
          textAlign: 'center', marginBottom: 6,
        }}>
          {isKo ? '챌린지 스킨 선택' : 'choose challenge skin'}
        </h3>

        {canUnlock && (
          <p style={{
            textAlign: 'center', fontSize: 14, color: '#e67e22',
            fontWeight: 700, fontFamily: "'JejuGothic', sans-serif",
            marginBottom: 16,
            animation: 'pulseGlow 1.5s ease infinite',
          }}>
            🎁 {isKo ? '새 스킨을 골라보세요!' : 'pick a new skin to unlock!'}
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12, maxWidth: 600, margin: '0 auto',
        }}>
          {SKIN_LIST.map(skin => {
            const isUnlocked = unlockedSkins.includes(skin.id)
            const isActive = currentSkin === skin.id
            const isHovered = hoveredSkin === skin.id
            const canPickToUnlock = !isUnlocked && canUnlock

            return (
              <button
                key={skin.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelect(skin.id)
                    onClose()
                  } else if (canPickToUnlock) {
                    onUnlock(skin.id)
                    onSelect(skin.id)
                    onClose()
                  }
                }}
                onMouseEnter={() => setHoveredSkin(skin.id)}
                onMouseLeave={() => setHoveredSkin(null)}
                style={{
                  background: canPickToUnlock ? '#fff8e8' : '#fff',
                  border: isActive ? '2.5px solid #222'
                    : canPickToUnlock ? '2px dashed #e67e22'
                    : '1.5px solid #ddd',
                  padding: '16px 12px',
                  cursor: (isUnlocked || canPickToUnlock) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  transform: isHovered && (isUnlocked || canPickToUnlock) ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isActive ? '3px 3px 0 #222' : 'none',
                  position: 'relative',
                  opacity: (!isUnlocked && !canPickToUnlock) ? 0.4 : 1,
                }}
              >
                {/* Selected indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    background: '#222', color: '#fff',
                    width: 22, height: 22, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>✓</div>
                )}

                {/* Unlock badge */}
                {canPickToUnlock && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#e67e22', color: '#fff',
                    padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    fontFamily: "'JejuGothic', sans-serif",
                    animation: 'pulseGlow 1.5s ease infinite',
                  }}>
                    🎁 {isKo ? '선택!' : 'pick!'}
                  </div>
                )}

                {/* Lock icon for truly locked */}
                {!isUnlocked && !canPickToUnlock && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#222', color: '#fff',
                    padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    fontFamily: "'JejuGothic', sans-serif",
                  }}>
                    🔒
                  </div>
                )}

                {/* Bear preview grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2, justifyItems: 'center', marginBottom: 10,
                  filter: (!isUnlocked && !canPickToUnlock) ? 'grayscale(100%)' : 'none',
                  overflow: 'hidden',
                }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <BearSVG
                      key={i}
                      index={i}
                      filled={i < 4}
                      onClick={() => {}}
                      size={32}
                      disabled
                      skinId={skin.id}
                    />
                  ))}
                </div>

                <div style={{
                  fontSize: 15, fontWeight: 700,
                  color: (!isUnlocked && !canPickToUnlock) ? '#aaa' : '#222',
                  fontFamily: "'JejuGothic', sans-serif",
                  textAlign: 'center',
                }}>
                  {isKo ? skin.nameKo : skin.nameEn}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
