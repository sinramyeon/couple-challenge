import { useState, useEffect, useRef } from 'react'
import BearSVG from './BearSVG'
import EditableGoal from './EditableGoal'
import ProgressBar from './ProgressBar'
// import AchievementBadges from './AchievementBadges'
import { HandDrawnCard } from './WashiTape'
import { Sticker } from './WashiTape'
import { CRAYON_COLORS, STICKERS } from '../lib/skins'

function getLongestStreak(days) {
  let max = 0, cur = 0
  for (const d of days) {
    if (d) { cur++; max = Math.max(max, cur) }
    else cur = 0
  }
  return max
}

function getTodayIndex(startDate) {
  if (!startDate) return -1
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.floor((now - start) / 86400000)
  return diff >= 0 && diff < 30 ? diff : -1
}

function getStreakSticker(streak) {
  if (streak >= 25) return STICKERS.streak25
  if (streak >= 20) return STICKERS.streak20
  if (streak >= 15) return STICKERS.streak15
  if (streak >= 10) return STICKERS.streak10
  if (streak >= 7) return STICKERS.streak7
  if (streak >= 5) return STICKERS.streak5
  if (streak >= 3) return STICKERS.streak3
  return null
}

export default function ChallengeCard({
  label, goal, onGoalSave, days, onToggle, isOwner, t, encouragement,
  startDate, skinId = 'stripe', onRestart, bothComplete,
}) {
  const filledCount = days.filter(Boolean).length
  const progress = Math.round((filledCount / 30) * 100)
  const streak = getLongestStreak(days)
  const todayIndex = getTodayIndex(startDate)
  const [streakBounce, setStreakBounce] = useState(false)
  const prevFilled = useRef(filledCount)
  const streakSticker = getStreakSticker(streak)

  useEffect(() => {
    if (filledCount > prevFilled.current) {
      setStreakBounce(true)
      const timer = setTimeout(() => setStreakBounce(false), 500)
      prevFilled.current = filledCount
      return () => clearTimeout(timer)
    }
    prevFilled.current = filledCount
  }, [filledCount])

  // Pick a tape color based on the card owner
  const tapeIdx = isOwner ? 0 : 3

  return (
    <HandDrawnCard tapeIndex={tapeIdx} tapePosition="top-right">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: 26, fontWeight: 700, color: '#222',
          fontFamily: "'JejuGothic', sans-serif",
        }}>{label}</span>

        {isOwner && (
          <span style={{
            fontSize: 12, background: '#222', color: '#fff',
            padding: '2px 10px', fontWeight: 700,
            fontFamily: "'JejuGothic', sans-serif",
            // Slightly rotated like a stamp
            transform: 'rotate(-2deg)',
            display: 'inline-block',
          }}>{t.meTag}</span>
        )}

        {/* Streak badge with sticker */}
        {streak >= 2 && (
          <span style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 16, fontWeight: 700, color: '#222',
            fontFamily: "'JejuGothic', sans-serif",
            border: '1.5px solid #222', padding: '3px 10px',
            background: '#fff',
            animation: streakBounce ? 'countBounce 0.4s ease' : 'none',
          }}>
            {streakSticker && <Sticker emoji={streakSticker} size={18} rotation={-5} />}
            <span style={{
              display: 'inline-block',
              width: 10, height: 10, borderRadius: '50%',
              background: CRAYON_COLORS[streak % CRAYON_COLORS.length],
              border: '1px solid #333',
            }} />
            {streak} {t.streakLabel}
          </span>
        )}
      </div>

      {/* Goal */}
      <EditableGoal goal={goal} onSave={onGoalSave} isOwner={isOwner} t={t} />

      {/* Encouragement */}
      {encouragement}

      {/* Progress bar */}
      <ProgressBar filled={filledCount} t={t} />

      {/* Achievement badges removed */}

      {/* Bear grid — responsive */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '4px 0', justifyItems: 'center', marginBottom: 16,
        padding: '12px 0', overflow: 'hidden',
      }}>
        {days.map((filled, i) => (
          <BearSVG
            key={i}
            index={i}
            filled={filled}
            isToday={i === todayIndex}
            skinId={skinId}
            onClick={() => {
              if (filled && isOwner) {
                if (!window.confirm(t.uncheckConfirm)) return
              }
              onToggle(i)
            }}
            size={50}
            disabled={!isOwner}
            t={t}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: 16,
        borderTop: '1.5px dashed #ddd', paddingTop: 12,
      }}>
        <span>
          <span style={{
            color: '#222', fontWeight: 700, fontSize: 28,
            fontFamily: "'JejuGothic', sans-serif",
            animation: streakBounce ? 'countBounce 0.4s ease' : 'none',
          }}>{filledCount}</span>
          <span style={{ color: '#999', fontWeight: 700 }}> / 30{t.days}</span>
        </span>
        <span style={{ position: 'relative' }}>
          <span
            onClick={filledCount === 30 && bothComplete && onRestart ? onRestart : undefined}
            style={{
              background: filledCount === 30 ? '#222' : '#fff',
              color: filledCount === 30 ? '#fff' : '#444',
              padding: '4px 14px', fontWeight: 700, fontSize: 15,
              fontFamily: "'JejuGothic', sans-serif",
              border: '1.5px solid #222',
              cursor: filledCount === 30 && bothComplete && onRestart ? 'pointer' : 'default',
              animation: filledCount === 30 && bothComplete
                ? 'pulseGlow 1.5s ease infinite, wiggle 2s ease infinite'
                : filledCount === 30 ? 'pulseGlow 1.5s ease infinite' : 'none',
              transition: 'transform 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={e => { if (filledCount === 30 && bothComplete) e.currentTarget.style.transform = 'scale(1.1)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {filledCount === 30 ? t.complete : `${progress}%`}
          </span>
          {/* "Click to restart" tooltip */}
          {filledCount === 30 && bothComplete && onRestart && (
            <span style={{
              position: 'absolute', bottom: '140%', right: 0,
              whiteSpace: 'nowrap',
              background: '#222', color: '#fff',
              padding: '6px 16px', fontSize: 14, fontWeight: 700,
              fontFamily: "'JejuGothic', sans-serif",
              animation: 'badgePop 0.5s ease, gentleFloat 2s ease infinite',
              zIndex: 50,
              boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
            }}>
              {t.restartNewGoal || '새로운 목표로 다시 시작!'}
              <span style={{
                position: 'absolute', top: '100%', right: 20,
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #222',
              }} />
            </span>
          )}
        </span>
      </div>

      {/* Decorative corner stickers when nearing completion */}
      {filledCount >= 25 && filledCount < 30 && (
        <Sticker emoji="🌈" size={24} rotation={15}
          style={{ position: 'absolute', bottom: 8, right: 8 }} />
      )}
      {filledCount === 30 && (
        <>
          <Sticker emoji="🎊" size={28} rotation={-10}
            style={{ position: 'absolute', bottom: 8, right: 8 }} />
          <Sticker emoji="🏆" size={24} rotation={12}
            style={{ position: 'absolute', bottom: 8, left: 8 }} />
        </>
      )}
    </HandDrawnCard>
  )
}