import { useState, useEffect, useCallback, useRef } from 'react'
import { getTranslations } from './lib/i18n'
import ChallengeCard from './components/ChallengeCard'
import EncouragementBanner from './components/EncouragementBanner'
import { Confetti, CelebrationModal } from './components/Celebration'
import MilestoneToast, { CheckInPop } from './components/MilestoneToast'

const MILESTONE_THRESHOLDS = [1, 3, 5, 7, 10, 15, 20, 25, 28, 30]

// Mock challenge data - toggle days locally without Supabase
function useMockChallenge() {
  const [challenge, setChallenge] = useState({
    id: 'dev-mock',
    email_a: 'me@test.com',
    email_b: 'partner@test.com',
    name_a: 'Me',
    name_b: 'Partner',
    goal_a: 'Exercise every day',
    goal_b: 'Read 30 minutes',
    days_a: [true, true, true, true, true, false, false, false, false, false,
             false, false, false, false, false, false, false, false, false, false,
             false, false, false, false, false, false, false, false, false, false],
    days_b: [true, true, true, false, false, false, false, false, false, false,
             false, false, false, false, false, false, false, false, false, false,
             false, false, false, false, false, false, false, false, false, false],
    status: 'active',
  })

  const mySide = 'a'

  const toggleDay = (dayIndex) => {
    const daysKey = `days_${mySide}`
    setChallenge(prev => {
      const newDays = [...prev[daysKey]]
      newDays[dayIndex] = !newDays[dayIndex]
      return { ...prev, [daysKey]: newDays }
    })
  }

  const updateGoal = (newGoal) => {
    const goalKey = `goal_${mySide}`
    setChallenge(prev => ({ ...prev, [goalKey]: newGoal }))
  }

  return { challenge, mySide, toggleDay, updateGoal }
}

/* ───────── Top Bar (dev version) ───────── */
function TopBar({ lang, setLang, t }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#fff', borderBottom: '1.5px solid #222',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', height: 48,
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#222', fontFamily: "'Gaegu', sans-serif" }}>
        {t.title}
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#c00', marginLeft: 8,
          border: '1px solid #c00', padding: '2px 6px',
        }}>DEV</span>
      </span>
      <button
        onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
        style={{
          background: '#fff', border: '1.5px solid #222', borderRadius: 0,
          padding: '4px 12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          color: '#222', fontFamily: "'Gaegu', sans-serif",
        }}
      >
        {lang === 'ko' ? 'EN' : '\uD55C\uAD6D\uC5B4'}
      </button>
    </div>
  )
}

/* ───────── Dev App ───────── */
export default function DevApp() {
  const [lang, setLang] = useState(() => localStorage.getItem('challenge-lang') || 'ko')
  useEffect(() => { localStorage.setItem('challenge-lang', lang) }, [lang])

  const { challenge, mySide, toggleDay, updateGoal } = useMockChallenge()
  const t = getTranslations(lang)

  const otherSide = mySide === 'a' ? 'b' : 'a'
  const [celebration, setCelebration] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState(null)
  const [sparkle, setSparkle] = useState(null)
  const prevMyCount = useRef(0)
  const prevCounts = useRef({ a: 0, b: 0 })

  const myCount = challenge[`days_${mySide}`].filter(Boolean).length
  const otherCount = challenge[`days_${otherSide}`].filter(Boolean).length
  const countA = challenge.days_a.filter(Boolean).length
  const countB = challenge.days_b.filter(Boolean).length

  useEffect(() => {
    if (myCount > prevMyCount.current) {
      for (const threshold of MILESTONE_THRESHOLDS) {
        if (myCount >= threshold && prevMyCount.current < threshold) {
          const m = t.milestones[threshold]
          if (m && threshold < 30) setTimeout(() => setMilestone(m), 300)
          if ([10, 15, 20, 25].includes(threshold)) {
            setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2500) }, 200)
          }
          break
        }
      }
    }
    prevMyCount.current = myCount
  }, [myCount, t])

  useEffect(() => {
    if (countA === 30 && prevCounts.current.a < 30)
      setTimeout(() => { setCelebration(challenge.name_a); setShowConfetti(true) }, 400)
    if (countB === 30 && prevCounts.current.b < 30)
      setTimeout(() => { setCelebration(challenge.name_b); setShowConfetti(true) }, 400)
    prevCounts.current = { a: countA, b: countB }
  }, [challenge, countA, countB])

  useEffect(() => {
    const handler = (e) => setSparkle({ ...e.detail, id: Date.now() })
    window.addEventListener('checkin-sparkle', handler)
    return () => window.removeEventListener('checkin-sparkle', handler)
  }, [])

  const clearMilestone = useCallback(() => setMilestone(null), [])

  const cardProps = (side) => ({
    label: challenge[`name_${side}`],
    goal: challenge[`goal_${side}`],
    onGoalSave: (g) => updateGoal(g),
    days: challenge[`days_${side}`],
    onToggle: (i) => toggleDay(i),
    isOwner: side === mySide,
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    t,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <TopBar lang={lang} setLang={setLang} t={t} />

      <div style={{ padding: '64px 16px 24px', minHeight: '100vh' }}>
        <Confetti show={showConfetti} />
        <MilestoneToast milestone={milestone} onDone={clearMilestone} />
        {sparkle && <CheckInPop key={sparkle.id} show={true} x={sparkle.x} y={sparkle.y} color={sparkle.color} />}
        {celebration && (
          <CelebrationModal name={celebration} t={t}
            onClose={() => { setCelebration(null); setTimeout(() => setShowConfetti(false), 500) }} />
        )}

        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ color: '#999', fontSize: 15, fontWeight: 700, margin: 0 }}>
              {t.daysRemaining(Math.max(0, 30 - Math.max(countA, countB)))}
            </p>
          </div>

          <div className="cards-container" style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ChallengeCard {...cardProps(otherSide)} encouragement={null} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ChallengeCard
                {...cardProps(mySide)}
                encouragement={
                  myCount < otherCount - 2
                    ? <EncouragementBanner myCount={myCount} theirCount={otherCount}
                        theirName={challenge[`name_${otherSide}`]} lang={lang} t={t} />
                    : null
                }
              />
            </div>
          </div>

          <div style={{
            textAlign: 'center', marginTop: 16, padding: '12px 16px',
            border: '1.5px solid #ddd', background: '#fafafa',
          }}>
            <p style={{ fontSize: 14, color: '#888', fontWeight: 700, margin: 0 }}>
              {t.footerTip}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .cards-container { flex-direction: row !important; }
        @media (max-width: 640px) {
          .cards-container { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
