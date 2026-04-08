import { useState, useEffect, useCallback, useRef } from 'react'
import { getTranslations } from './lib/i18n'
import { SKIN_LIST, DEFAULT_SKIN } from './lib/skins'
import ChallengeCard from './components/ChallengeCard'
import EncouragementBanner from './components/EncouragementBanner'
import { Confetti, CelebrationModal } from './components/Celebration'
import MilestoneToast, { CheckInPop } from './components/MilestoneToast'
import CoupleLevelBar, { calculateXP, calculateCoupleXP, getLevel, XPPopup } from './components/LevelSystem'
import { NudgeButton, InteractionToast } from './components/CoupleInteractions'
import SkinPicker from './components/SkinPicker'
import BearSVG from './components/BearSVG'

const MILESTONE_THRESHOLDS = [1, 3, 5, 7, 10, 15, 20, 25, 28, 30]

// ─── Mock challenge with both sides toggleable ───
function useMockChallenge() {
  const [challenge, setChallenge] = useState({
    id: 'dev-mock',
    email_a: 'me@test.com',
    email_b: 'partner@test.com',
    name_a: 'Seolhwa',
    name_b: 'Roberto',
    goal_a: 'stretch+pushup',
    goal_b: '',
    days_a: Array(30).fill(false),
    days_b: Array(30).fill(false),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'active',
  })

  const [mySide, setMySide] = useState('a')

  const toggleDay = (side, dayIndex) => {
    const daysKey = `days_${side}`
    setChallenge(prev => {
      const newDays = [...prev[daysKey]]
      newDays[dayIndex] = !newDays[dayIndex]
      return { ...prev, [daysKey]: newDays }
    })
  }

  const updateGoal = (side, newGoal) => {
    setChallenge(prev => ({ ...prev, [`goal_${side}`]: newGoal }))
  }

  const fillDays = (side, count) => {
    setChallenge(prev => ({
      ...prev,
      [`days_${side}`]: Array(30).fill(false).map((_, i) => i < count),
    }))
  }

  const resetAll = () => {
    setChallenge(prev => ({
      ...prev,
      days_a: Array(30).fill(false),
      days_b: Array(30).fill(false),
    }))
  }

  // Restart with XP banked (like production)
  const restartWithXP = () => {
    setChallenge(prev => {
      const currentXP = calculateCoupleXP(prev.days_a, prev.days_b)
      return {
        ...prev,
        days_a: Array(30).fill(false),
        days_b: Array(30).fill(false),
        goal_a: '',
        goal_b: '',
        banked_xp: (prev.banked_xp || 0) + currentXP,
        created_at: new Date().toISOString(),
      }
    })
  }

  return { challenge, mySide, setMySide, toggleDay, updateGoal, fillDays, resetAll, restartWithXP }
}

/* ─── Dev Control Panel ─── */
function DevPanel({ challenge, mySide, setMySide, fillDays, resetAll, skinId, setSkinId, setShowSkinPicker, lang }) {
  const coupleXP = calculateCoupleXP(challenge.days_a, challenge.days_b) + (challenge.banked_xp || 0)
  const { level } = getLevel(coupleXP)
  const xpA = calculateXP(challenge.days_a)
  const xpB = calculateXP(challenge.days_b)
  const countA = challenge.days_a.filter(Boolean).length
  const countB = challenge.days_b.filter(Boolean).length
  const isKo = lang === 'ko'

  return (
    <div style={{
      background: '#1a1a1a', color: '#eee', padding: '16px 20px',
      fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8,
      borderBottom: '3px solid #ff4444',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#ff4444' }}>🛠 DEV PANEL</span>
        <span style={{ color: '#888' }}>|</span>
        <span>Couple XP: <b style={{ color: '#4f8' }}>{coupleXP}</b></span>
        <span>Lv: <b style={{ color: '#4df' }}>{level}</b></span>
        <span>A({countA}/30): <b style={{ color: '#fa0' }}>{xpA}xp</b></span>
        <span>B({countB}/30): <b style={{ color: '#fa0' }}>{xpB}xp</b></span>
        <span>Skin: <b style={{ color: '#f8f' }}>{skinId}</b></span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Side toggle */}
        <span style={{ color: '#aaa' }}>My side:</span>
        {['a', 'b'].map(s => (
          <button key={s} onClick={() => setMySide(s)} style={{
            background: mySide === s ? '#ff4444' : '#333', color: '#fff',
            border: 'none', padding: '4px 12px', cursor: 'pointer', fontWeight: 700,
          }}>{s.toUpperCase()}</button>
        ))}

        <span style={{ color: '#555' }}>|</span>

        {/* Quick fill */}
        <span style={{ color: '#aaa' }}>Fill A:</span>
        {[5, 10, 15, 20, 25, 30].map(n => (
          <button key={`a${n}`} onClick={() => fillDays('a', n)} style={{
            background: '#333', color: '#4f8', border: '1px solid #4f8',
            padding: '2px 8px', cursor: 'pointer', fontSize: 11,
          }}>{n}</button>
        ))}

        <span style={{ color: '#aaa' }}>Fill B:</span>
        {[5, 10, 15, 20, 25, 30].map(n => (
          <button key={`b${n}`} onClick={() => fillDays('b', n)} style={{
            background: '#333', color: '#fa0', border: '1px solid #fa0',
            padding: '2px 8px', cursor: 'pointer', fontSize: 11,
          }}>{n}</button>
        ))}

        <span style={{ color: '#555' }}>|</span>

        <button onClick={resetAll} style={{
          background: '#333', color: '#f44', border: '1px solid #f44',
          padding: '4px 12px', cursor: 'pointer', fontWeight: 700,
        }}>Reset All</button>

        <button onClick={() => setShowSkinPicker(true)} style={{
          background: '#333', color: '#f8f', border: '1px solid #f8f',
          padding: '4px 12px', cursor: 'pointer', fontWeight: 700,
        }}>🎨 Skins</button>
      </div>

      {/* Level thresholds */}
      <div style={{ marginTop: 10, fontSize: 11, color: '#666' }}>
        Lv.1=0 → Lv.2=700 → Lv.3=1500 → Lv.4=3000 XP
        {' | '}Skins: {SKIN_LIST.map(s => `${s.id}(Lv.${s.unlockLevel})`).join(', ')}
      </div>
    </div>
  )
}

/* ─── Dev App ─── */
export default function DevApp() {
  const [lang, setLang] = useState(() => localStorage.getItem('challenge-lang') || 'ko')
  useEffect(() => { localStorage.setItem('challenge-lang', lang) }, [lang])

  const { challenge, mySide, setMySide, toggleDay, updateGoal, fillDays, resetAll, restartWithXP } = useMockChallenge()
  const [skinId, setSkinId] = useState(DEFAULT_SKIN)
  const [showSkinPicker, setShowSkinPicker] = useState(false)
  const [nudgeToast, setNudgeToast] = useState(null)

  const t = getTranslations(lang)
  const otherSide = mySide === 'a' ? 'b' : 'a'

  const [celebration, setCelebration] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState(null)
  const [sparkle, setSparkle] = useState(null)
  const [xpPopup, setXpPopup] = useState(null)
  const prevMyCount = useRef(0)
  const prevCounts = useRef({ a: 0, b: 0 })
  const prevXP = useRef(0)

  const myCount = challenge[`days_${mySide}`].filter(Boolean).length
  const otherCount = challenge[`days_${otherSide}`].filter(Boolean).length
  const countA = challenge.days_a.filter(Boolean).length
  const countB = challenge.days_b.filter(Boolean).length

  const coupleXP = calculateCoupleXP(challenge.days_a, challenge.days_b) + (challenge.banked_xp || 0)
  const coupleLevel = getLevel(coupleXP).level

  // XP popup
  const myXP = calculateXP(challenge[`days_${mySide}`])
  const prevLevelRef = useRef(coupleLevel)

  useEffect(() => {
    if (myXP > prevXP.current && prevXP.current > 0) {
      setXpPopup(myXP - prevXP.current)
      const timer = setTimeout(() => setXpPopup(null), 1200)
      prevXP.current = myXP
      return () => clearTimeout(timer)
    }
    prevXP.current = myXP
  }, [myXP])

  // Level up → auto open skin picker
  useEffect(() => {
    if (coupleLevel > prevLevelRef.current && prevLevelRef.current > 0) {
      setTimeout(() => setShowSkinPicker(true), 1500)
    }
    prevLevelRef.current = coupleLevel
  }, [coupleLevel])

  // Milestones
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

  // Celebration
  useEffect(() => {
    if (countA === 30 && prevCounts.current.a < 30)
      setTimeout(() => { setCelebration(challenge.name_a); setShowConfetti(true) }, 400)
    if (countB === 30 && prevCounts.current.b < 30)
      setTimeout(() => { setCelebration(challenge.name_b); setShowConfetti(true) }, 400)
    prevCounts.current = { a: countA, b: countB }
  }, [challenge, countA, countB])

  // Sparkle
  useEffect(() => {
    const handler = (e) => setSparkle({ ...e.detail, id: Date.now() })
    window.addEventListener('checkin-sparkle', handler)
    return () => window.removeEventListener('checkin-sparkle', handler)
  }, [])

  const clearMilestone = useCallback(() => setMilestone(null), [])

  const handleNudge = () => {
    const isKo = lang === 'ko'
    setNudgeToast({
      emoji: '👉',
      message: isKo
        ? `${challenge[`name_${mySide}`]}이(가) 뭐하냐고 하네요!`
        : `${challenge[`name_${mySide}`]} nudged you ro!!`,
    })
    setTimeout(() => setNudgeToast(null), 3000)
  }

  const bothComplete = countA === 30 && countB === 30
  const isKo = lang === 'ko'

  const handleRestart = () => {
    const msg = isKo
      ? '새로운 목표로 다시 시작할까요?\n\n- 파트너 유지\n- 레벨/XP 유지\n- 목표 + 체크인 초기화'
      : 'start a new goal ro?\n\n- same partner\n- level/XP kept\n- goal + streaks reset'
    if (window.confirm(msg)) restartWithXP()
  }

  const cardProps = (side) => ({
    label: challenge[`name_${side}`],
    goal: challenge[`goal_${side}`],
    onGoalSave: (g) => updateGoal(side, g),
    days: challenge[`days_${side}`],
    onToggle: (i) => toggleDay(side, i),
    isOwner: side === mySide,
    startDate: challenge.created_at,
    skinId,
    t,
    bothComplete,
    onRestart: bothComplete ? handleRestart : undefined,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Dev Panel */}
      <DevPanel
        challenge={challenge} mySide={mySide} setMySide={setMySide}
        fillDays={fillDays} resetAll={resetAll}
        skinId={skinId} setSkinId={setSkinId}
        setShowSkinPicker={setShowSkinPicker} lang={lang}
      />

      {/* Top Bar */}
      <div style={{
        background: '#fff', borderBottom: '2px solid #333',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', height: 52,
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#333', fontFamily: "'JejuGothic', sans-serif" }}>
          {t.title}
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#fff', marginLeft: 8,
            background: '#ff4444', padding: '2px 8px',
          }}>DEV</span>
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} style={{
            background: '#fff', border: '1.5px solid #333',
            padding: '4px 12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'JejuGothic', sans-serif",
          }}>
            {lang === 'ko' ? 'EN' : '한국어'}
          </button>
          <button onClick={() => setShowSkinPicker(true)} style={{
            background: '#fff', border: '1.5px solid #333',
            padding: '4px 10px', fontSize: 16, cursor: 'pointer',
          }}>🎨</button>
        </div>
      </div>

      <div style={{ padding: '16px', minHeight: '100vh' }}>
        <Confetti show={showConfetti} />
        <MilestoneToast milestone={milestone} onDone={clearMilestone} />
        <XPPopup xpGained={xpPopup} show={!!xpPopup} t={t} />
        {sparkle && <CheckInPop key={sparkle.id} show={true} x={sparkle.x} y={sparkle.y} color={sparkle.color} />}
        {celebration && (
          <CelebrationModal name={celebration} t={t}
            onClose={() => { setCelebration(null); setTimeout(() => setShowConfetti(false), 500) }} />
        )}
        {nudgeToast && (
          <InteractionToast emoji={nudgeToast.emoji} message={nudgeToast.message}
            onDismiss={() => setNudgeToast(null)} />
        )}

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Couple Level */}
          <CoupleLevelBar daysA={challenge.days_a} daysB={challenge.days_b} bankedXP={challenge.banked_xp || 0} t={t} />

          {/* Nudge */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0', marginBottom: 8 }}>
            <NudgeButton onNudge={handleNudge} cooldown={false} t={t} />
          </div>

          {/* Cards */}
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

          {/* Footer */}
          <div style={{
            textAlign: 'center', marginTop: 16, padding: '12px 16px',
            border: '1.5px dashed #ddd', background: 'rgba(255,255,255,0.7)',
          }}>
            <p style={{ fontSize: 14, color: '#888', fontWeight: 700, margin: 0,
              fontFamily: "'JejuGothic', sans-serif" }}>
              {t.footerTip}
            </p>
          </div>

          {/* All skins preview */}
          <div style={{
            marginTop: 24, padding: 20, border: '2px solid #ddd',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: "'JejuGothic', sans-serif" }}>
              All Skins Preview (current level: {coupleLevel})
            </h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {SKIN_LIST.map(skin => {
                const locked = coupleLevel < skin.unlockLevel
                return (
                  <div key={skin.id} style={{
                    textAlign: 'center', opacity: locked ? 0.4 : 1,
                    border: skinId === skin.id ? '2px solid #222' : '1px solid #ddd',
                    padding: 12, cursor: locked ? 'not-allowed' : 'pointer',
                  }} onClick={() => !locked && setSkinId(skin.id)}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
                      {[0, 1, 2].map(i => (
                        <BearSVG key={i} index={i} filled={true} onClick={() => {}} size={40} disabled skinId={skin.id} />
                      ))}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JejuGothic', sans-serif" }}>
                      {lang === 'ko' ? skin.nameKo : skin.nameEn}
                      {locked && ` 🔒 Lv.${skin.unlockLevel}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showSkinPicker && (
        <SkinPicker
          currentSkin={skinId}
          onSelect={setSkinId}
          onClose={() => setShowSkinPicker(false)}
          lang={lang}
          coupleLevel={999}
        />
      )}

      <style>{`
        .cards-container { flex-direction: row !important; }
        @media (max-width: 640px) {
          .cards-container { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
