import { useState, useEffect, useRef } from 'react'
import BearCircle from './BearCircle'
import EditableGoal from './EditableGoal'
import ProgressBar from './ProgressBar'
import AchievementBadges from './AchievementBadges'
import { CRAYON_COLORS } from '../lib/constants'

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

export default function ChallengeCard({
  label, goal, onGoalSave, days, onToggle, isOwner, t, encouragement, startDate,
}) {
  const filledCount = days.filter(Boolean).length
  const progress = Math.round((filledCount / 30) * 100)
  const streak = getLongestStreak(days)
  const todayIndex = getTodayIndex(startDate)
  const [streakBounce, setStreakBounce] = useState(false)
  const prevFilled = useRef(filledCount)

  useEffect(() => {
    if (filledCount > prevFilled.current) {
      setStreakBounce(true)
      const t = setTimeout(() => setStreakBounce(false), 500)
      prevFilled.current = filledCount
      return () => clearTimeout(t)
    }
    prevFilled.current = filledCount
  }, [filledCount])

  return (
    <div style={{
      background: '#fff', borderRadius: 0, padding: '22px 20px 18px',
      border: '1.5px solid #222',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>{label}</span>
        {isOwner && (
          <span style={{
            fontSize: 13, background: '#222', color: '#fff',
            padding: '2px 10px', borderRadius: 2, fontWeight: 700,
          }}>{t.meTag}</span>
        )}
        {/* Streak badge */}
        {streak >= 2 && (
          <span style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 15, fontWeight: 700, color: '#222',
            border: '1.5px solid #222', padding: '3px 10px',
            background: '#fff',
            animation: streakBounce ? 'countBounce 0.4s ease' : 'none',
          }}>
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

      {/* goal — prominent */}
      <EditableGoal goal={goal} onSave={onGoalSave} isOwner={isOwner} t={t} />

      {/* encouragement */}
      {encouragement}

      {/* Progress bar */}
      <ProgressBar filled={filledCount} t={t} />

      {/* Achievement badges */}
      <AchievementBadges filled={filledCount} t={t} />

      {/* grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '2px 4px', justifyItems: 'center', marginBottom: 16,
      }}>
        {days.map((filled, i) => (
          <BearCircle
            key={i} index={i} filled={filled}
            isToday={i === todayIndex}
            onClick={() => {
              if (filled && isOwner) {
                if (!window.confirm(t.uncheckConfirm)) return
              }
              onToggle(i)
            }}
            size={44}
            disabled={!isOwner}
            t={t}
          />
        ))}
      </div>

      {/* footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: 16,
        borderTop: '1px dashed #ddd', paddingTop: 12,
      }}>
        <span>
          <span style={{
            color: '#222', fontWeight: 700, fontSize: 24,
            animation: streakBounce ? 'countBounce 0.4s ease' : 'none',
          }}>{filledCount}</span>
          <span style={{ color: '#999', fontWeight: 700 }}> / 30{t.days}</span>
        </span>
        <span style={{
          background: filledCount === 30 ? '#222' : '#fff',
          color: filledCount === 30 ? '#fff' : '#444',
          padding: '4px 14px', borderRadius: 2, fontWeight: 700, fontSize: 15,
          border: '1.5px solid #222',
          animation: filledCount === 30 ? 'pulseGlow 1.5s ease infinite' : 'none',
        }}>
          {filledCount === 30 ? t.complete : `${progress}%`}
        </span>
      </div>
    </div>
  )
}
