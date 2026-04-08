import { useState, useEffect, useRef } from 'react'
import { CRAYON_COLORS } from '../lib/skins'

/*
  LevelSystem — XP & levels with skin unlocks.

  XP earned by:
  - Each check-in: +10 XP
  - 3-day streak bonus: +5 XP
  - 7-day streak bonus: +15 XP
  - 10-day streak bonus: +30 XP
  - Both check in same day: +10 XP
  - Milestone (10,15,20,25,30 days): +20 XP each

  Levels & skin unlocks (max Lv.100):
  Max XP per 30-day challenge (couple, perfect): ~1200 XP
  Lv.1 =    0 XP — 담곰 (default)
  Lv.2 =  700 XP — 울보 담곰 unlock
  Lv.3 = 1500 XP — 부들 담곰 unlock
  Lv.4 = 3000 XP — 치이카와 unlock
  Lv.5+ = every 1000 XP after Lv.4
*/

// Generate thresholds: Lv1=0, Lv2=700, Lv3=1500, Lv4=3000, then +1000 per level
const LEVEL_THRESHOLDS = (() => {
  const t = [0, 700, 1500, 3000]
  for (let i = 4; i < 100; i++) {
    t.push(t[i - 1] + 1000)
  }
  return t
})()

export function getLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      const nextThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i] + 1000
      const isMax = i + 1 >= 100
      return {
        level: i + 1,
        currentXP: xp - LEVEL_THRESHOLDS[i],
        nextXP: nextThreshold - LEVEL_THRESHOLDS[i],
        isMax,
      }
    }
  }
  return { level: 1, currentXP: 0, nextXP: 700, isMax: false }
}

export function calculateXP(days) {
  let xp = 0
  let streak = 0
  let filled = 0

  for (const d of days) {
    if (d) {
      filled++
      streak++
      xp += 10 // base check-in

      // Streak bonuses (awarded once when streak is hit)
      if (streak === 3) xp += 5
      if (streak === 7) xp += 15
      if (streak === 10) xp += 30

      // Milestone bonuses
      if ([10, 15, 20, 25, 30].includes(filled)) xp += 20
    } else {
      streak = 0
    }
  }
  return xp
}

export function calculateCoupleXP(daysA, daysB) {
  let bonusXP = 0
  for (let i = 0; i < 30; i++) {
    if (daysA[i] && daysB[i]) bonusXP += 10
  }
  const baseA = calculateXP(daysA)
  const baseB = calculateXP(daysB)
  return baseA + baseB + bonusXP
}

// ─── Individual Level Badge (compact, for card header) ───
export function LevelBadge({ days, t }) {
  const xp = calculateXP(days)
  const { level } = getLevel(xp)
  const color = CRAYON_COLORS[(level * 3) % CRAYON_COLORS.length]

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 12, fontWeight: 700, color,
      fontFamily: "'JejuGothic', sans-serif",
      border: `1.5px solid ${color}`,
      padding: '1px 8px',
      background: `${color}15`,
    }}>
      {t.levelLabel}{level}
    </span>
  )
}

// ─── XP Gain Popup (shows +XP when checking in) ───
export function XPPopup({ xpGained, show, t }) {
  if (!show || !xpGained) return null

  return (
    <div style={{
      position: 'fixed', top: 100, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9980,
      fontSize: 20, fontWeight: 700, color: '#FFB347',
      fontFamily: "'JejuGothic', sans-serif",
      textShadow: '1px 1px 0 rgba(0,0,0,0.1)',
      animation: 'popUp 1s ease forwards',
      pointerEvents: 'none',
    }}>
      {t.xpGained(xpGained)}
    </div>
  )
}

// Skin names for level rewards
const LEVEL_REWARDS = {
  1: { ko: '담곰', en: 'Damgom' },
  2: { ko: '울보 담곰', en: 'Cry Damgom' },
  3: { ko: '부들 담곰', en: 'Shiver Damgom' },
  4: { ko: '치이카와', en: 'Chiikawa' },
}

// ─── Couple Level Display (between cards) ───
export default function CoupleLevelBar({ daysA, daysB, bankedXP = 0, t }) {
  const coupleXP = calculateCoupleXP(daysA, daysB) + bankedXP
  const { level, currentXP, nextXP, isMax } = getLevel(coupleXP)
  const progress = isMax ? 100 : Math.min((currentXP / nextXP) * 100, 100)
  const color = CRAYON_COLORS[(level * 5) % CRAYON_COLORS.length]
  const isKo = t.coupleLevel === '커플 레벨'
  const nextReward = LEVEL_REWARDS[level + 1]
  const [animate, setAnimate] = useState(false)
  const prevXP = useRef(coupleXP)

  useEffect(() => {
    if (coupleXP > prevXP.current) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 600)
      prevXP.current = coupleXP
      return () => clearTimeout(timer)
    }
    prevXP.current = coupleXP
  }, [coupleXP])

  return (
    <div style={{
      textAlign: 'center', padding: '12px 16px',
      background: '#fff',
      border: '1.5px solid #ddd',
      marginBottom: 12,
    }}>
      {/* Couple level header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, marginBottom: 8,
      }}>
        <span style={{ fontSize: 16 }}>💑</span>
        <span style={{
          fontSize: 16, fontWeight: 700, color: '#333',
          fontFamily: "'JejuGothic', sans-serif",
        }}>
          {t.coupleLevel}
        </span>
        <span style={{
          fontSize: 18, fontWeight: 700, color,
          fontFamily: "'JejuGothic', sans-serif",
          animation: animate ? 'countBounce 0.4s ease' : 'none',
        }}>
          {t.levelLabel}{level}
        </span>
      </div>

      {/* XP progress bar */}
      <div style={{
        height: 12, background: '#f0f0f0',
        border: '1px solid #ddd',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: color,
          transition: 'width 0.5s ease',
          position: 'relative',
        }}>
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            backgroundSize: '200px 100%',
            animation: 'shimmer 2s infinite',
          }} />
        </div>
      </div>

      {/* XP numbers */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, color: '#999', fontWeight: 700, marginTop: 4,
        fontFamily: "'JejuGothic', sans-serif",
      }}>
        <span>{currentXP} {t.xpLabel}</span>
        <span>{nextXP} {t.xpLabel}</span>
      </div>

      {/* Next skin unlock */}
      {nextReward && (
        <div style={{
          fontSize: 12, color: '#888', fontWeight: 700, marginTop: 8,
          fontFamily: "'JejuGothic', sans-serif",
          padding: '6px 12px',
          border: '1px dashed #ddd',
          background: '#fafafa',
        }}>
          🔓 Lv.{level + 1} → {isKo ? `${nextReward.ko} 해금` : `unlock ${nextReward.en} ro`}
        </div>
      )}
      {isMax && (
        <div style={{
          fontSize: 12, color: '#888', fontWeight: 700, marginTop: 8,
          fontFamily: "'JejuGothic', sans-serif",
        }}>
          ✨ {isKo ? '모든 스킨 해금 완료!' : 'all skins unlocked ro!'}
        </div>
      )}

      {/* XP breakdown */}
      <div style={{
        fontSize: 10, color: '#bbb', marginTop: 8, lineHeight: 1.6,
        fontFamily: "'JejuGothic', sans-serif",
      }}>
        {isKo
          ? '체크인 +10 · 3일연속 +5 · 7일연속 +15 · 동시체크인 +10 · 마일스톤 +20'
          : 'check-in +10 · 3-streak +5 · 7-streak +15 · same-day +10 · milestone +20'}
      </div>
    </div>
  )
}