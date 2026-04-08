import { useState } from 'react'
import { SKIN_LIST } from '../lib/skins'
import BearSVG from './BearSVG'

/*
  Skin picker — shows skins with level-based unlock.
  Locked skins show the required level.
*/

export default function SkinPicker({ currentSkin, onSelect, onClose, lang, coupleLevel }) {
  const [hoveredSkin, setHoveredSkin] = useState(null)
  const isKo = lang === 'ko'

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
          textAlign: 'center', marginBottom: 20,
        }}>
          {isKo ? '챌린지 스킨 선택' : 'choose bear skinrino'}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12, maxWidth: 600, margin: '0 auto',
        }}>
          {SKIN_LIST.map(skin => {
            const isActive = currentSkin === skin.id
            const isHovered = hoveredSkin === skin.id
            const isLocked = coupleLevel < skin.unlockLevel
            return (
              <button
                key={skin.id}
                onClick={() => {
                  if (!isLocked) { onSelect(skin.id); onClose() }
                }}
                onMouseEnter={() => setHoveredSkin(skin.id)}
                onMouseLeave={() => setHoveredSkin(null)}
                style={{
                  background: '#fff',
                  border: isActive ? '2.5px solid #222' : '1.5px solid #ddd',
                  padding: '16px 12px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  transform: isHovered && !isLocked ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isActive ? '3px 3px 0 #222' : 'none',
                  position: 'relative',
                  opacity: isLocked ? 0.5 : 1,
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

                {/* Lock overlay */}
                {isLocked && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#222', color: '#fff',
                    padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    fontFamily: "'JejuGothic', sans-serif",
                  }}>
                    🔒 Lv.{skin.unlockLevel}
                  </div>
                )}

                {/* Bear preview grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2, justifyItems: 'center', marginBottom: 10,
                  filter: isLocked ? 'grayscale(100%)' : 'none',
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
                  color: isLocked ? '#aaa' : '#222',
                  fontFamily: "'JejuGothic', sans-serif",
                  textAlign: 'center',
                }}>
                  {isKo ? skin.nameKo : skin.nameEn}
                </div>
                {isLocked && (
                  <div style={{
                    fontSize: 11, color: '#999', marginTop: 4,
                    fontFamily: "'JejuGothic', sans-serif",
                    textAlign: 'center',
                  }}>
                    {isKo
                      ? `커플 레벨 ${skin.unlockLevel} 달성 시 해금`
                      : `unlock at couple Lv.${skin.unlockLevel}o`}
                  </div>
                )}
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
