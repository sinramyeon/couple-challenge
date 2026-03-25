import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth, useChallenge } from './lib/hooks'
import { THEMES, CRAYON_COLORS } from './lib/constants'
import { getTranslations } from './lib/i18n'
import ChallengeCard from './components/ChallengeCard'
import EncouragementBanner from './components/EncouragementBanner'
import { Confetti, CelebrationModal } from './components/Celebration'
import MilestoneToast, { CheckInPop } from './components/MilestoneToast'

const MILESTONE_THRESHOLDS = [1, 3, 5, 7, 10, 15, 20, 25, 28, 30]

/* ───────── Language Toggle ───────── */
function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
      style={{
        position: 'fixed', top: 12, right: 12, zIndex: 100,
        background: '#fff', border: '1px solid #ddd', borderRadius: 2,
        padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        color: '#555', fontFamily: "'Gaegu', sans-serif",
      }}
    >
      {lang === 'ko' ? 'EN' : '한'}
    </button>
  )
}

/* ───────── Login Screen ───────── */
function LoginScreen({ onLogin, loading: authLoading, lang, setLang }) {
  const t = getTranslations(lang)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.includes('@')) { setError(t.invalidEmail); return }
    setLoading(true); setError('')
    const { error: err } = await onLogin(email)
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  if (authLoading) {
    return (
      <div style={styles.centered}>
        <LangToggle lang={lang} setLang={setLang} />
        <p style={{ color: '#999', fontSize: 15 }}>{t.loading}</p>
      </div>
    )
  }

  if (sent) {
    return (
      <div style={styles.centered}>
        <LangToggle lang={lang} setLang={setLang} />
        <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#222', margin: '0 0 12px' }}>
            {t.checkEmail}
          </h2>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
            <strong style={{ color: '#222' }}>{email}</strong>{t.sentTo}<br/>
            {t.clickLink}
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            style={{ ...styles.textBtn, marginTop: 20 }}
          >
            {t.tryOther} →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.centered}>
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ maxWidth: 380, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={{ color: '#999', fontSize: 15 }}>{t.subtitle}</p>
        </div>

        <div style={styles.card}>
          <p style={{ fontSize: 15, color: '#999', marginBottom: 16, textAlign: 'center' }}>
            {t.loginPrompt}
          </p>
          <input
            type="email" placeholder={t.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={styles.input}
          />
          {error && <p style={{ color: '#c00', fontSize: 13, margin: '8px 0 0' }}>{error}</p>}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{ ...styles.primaryBtn, marginTop: 12, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t.sending : t.sendLink}
          </button>
        </div>
        <p style={{ color: '#ccc', fontSize: 12, marginTop: 14, textAlign: 'center' }}>
          {t.noAccount}
        </p>
      </div>
    </div>
  )
}

/* ───────── Setup Screen ───────── */
function SetupScreen({ myEmail, onCreate, lang, setLang }) {
  const t = getTranslations(lang)
  const [partnerName, setPartnerName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [myName, setMyName] = useState('')
  const [loading, setLoading] = useState(false)

  const canStart = myName.trim() && partnerName.trim() && partnerEmail.includes('@')

  const handleCreate = async () => {
    setLoading(true)
    await onCreate({
      name1: myName.trim(), email1: myEmail,
      name2: partnerName.trim(), email2: partnerEmail.trim(),
    })
    setLoading(false)
  }

  return (
    <div style={styles.centered}>
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ ...styles.title, fontSize: 26 }}>{t.newChallenge}</h1>
          <p style={{ color: '#999', fontSize: 14 }}>{t.invitePartner}</p>
        </div>

        <div style={styles.card}>
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>{t.me}</label>
            <input type="text" placeholder={t.myName} value={myName}
              onChange={e => setMyName(e.target.value)} style={styles.input} />
            <div style={{
              padding: '8px 12px', background: '#fafafa', color: '#666', fontSize: 13,
              marginTop: 8, border: '1px dashed #ddd',
            }}>{myEmail}</div>
          </div>

          <div style={{ borderTop: '1px dashed #ddd', margin: '4px 0 20px' }} />

          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>{t.partner}</label>
            <input type="text" placeholder={t.partnerName} value={partnerName}
              onChange={e => setPartnerName(e.target.value)} style={styles.input} />
            <input type="email" placeholder={t.partnerEmail} value={partnerEmail}
              onChange={e => setPartnerEmail(e.target.value)}
              style={{ ...styles.input, marginTop: 8 }} />
          </div>

          <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', marginBottom: 16 }}>
            {t.goalLater}
          </p>

          <button onClick={handleCreate} disabled={!canStart || loading}
            style={{ ...styles.primaryBtn, opacity: (!canStart || loading) ? 0.5 : 1 }}>
            {loading ? t.creating : t.startChallenge}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── Challenge Screen ───────── */
function ChallengeScreen({ challenge, mySide, onToggle, onUpdateGoal, lang, setLang }) {
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

  // Milestone detection for my side
  useEffect(() => {
    if (myCount > prevMyCount.current) {
      // Check if we crossed a milestone
      for (const threshold of MILESTONE_THRESHOLDS) {
        if (myCount >= threshold && prevMyCount.current < threshold) {
          const m = t.milestones[threshold]
          if (m && threshold < 30) {
            setTimeout(() => setMilestone(m), 300)
          }
          // Mini confetti at 10, 15, 20, 25
          if ([10, 15, 20, 25].includes(threshold)) {
            setTimeout(() => {
              setShowConfetti(true)
              setTimeout(() => setShowConfetti(false), 2500)
            }, 200)
          }
          break
        }
      }
    }
    prevMyCount.current = myCount
  }, [myCount, t])

  // Full completion celebration
  useEffect(() => {
    if (countA === 30 && prevCounts.current.a < 30)
      setTimeout(() => { setCelebration(challenge.name_a); setShowConfetti(true) }, 400)
    if (countB === 30 && prevCounts.current.b < 30)
      setTimeout(() => { setCelebration(challenge.name_b); setShowConfetti(true) }, 400)
    prevCounts.current = { a: countA, b: countB }
  }, [challenge, countA, countB])

  // Listen for check-in sparkle events
  useEffect(() => {
    const handler = (e) => {
      setSparkle({ ...e.detail, id: Date.now() })
    }
    window.addEventListener('checkin-sparkle', handler)
    return () => window.removeEventListener('checkin-sparkle', handler)
  }, [])

  const clearMilestone = useCallback(() => setMilestone(null), [])

  const cardProps = (side) => ({
    label: challenge[`name_${side}`],
    goal: challenge[`goal_${side}`],
    onGoalSave: (g) => onUpdateGoal(g),
    days: challenge[`days_${side}`],
    onToggle: (i) => onToggle(i),
    theme: THEMES[side],
    isOwner: side === mySide,
    t,
  })

  const otherCard = (
    <div style={{ flex: 1, minWidth: 0 }}>
      <ChallengeCard
        {...cardProps(otherSide)}
        encouragement={null}
      />
    </div>
  )

  const myCard = (
    <div style={{ flex: 1, minWidth: 0 }}>
      <ChallengeCard
        {...cardProps(mySide)}
        encouragement={
          myCount < otherCount - 2
            ? <EncouragementBanner
                myCount={myCount} theirCount={otherCount}
                theirName={challenge[`name_${otherSide}`]}
                lang={lang} t={t}
              />
            : null
        }
      />
    </div>
  )

  return (
    <div style={{ padding: '20px 16px', minHeight: '100vh' }}>
      <LangToggle lang={lang} setLang={setLang} />
      <Confetti show={showConfetti} />
      <MilestoneToast milestone={milestone} onDone={clearMilestone} />

      {/* Check-in sparkle effect */}
      {sparkle && (
        <CheckInPop
          key={sparkle.id}
          show={true}
          x={sparkle.x}
          y={sparkle.y}
          color={sparkle.color}
        />
      )}

      {celebration && (
        <CelebrationModal
          name={celebration} t={t}
          onClose={() => { setCelebration(null); setTimeout(() => setShowConfetti(false), 500) }}
        />
      )}

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ ...styles.title, fontSize: 22, margin: 0 }}>{t.title}</h1>
          <p style={{ color: '#bbb', fontSize: 12, marginTop: 4 }}>
            {t.daysRemaining(Math.max(0, 30 - Math.max(countA, countB)))}
          </p>
        </div>

        {/* Cards */}
        <div className="cards-container" style={{ display: 'flex', gap: 16 }}>
          {otherCard}
          {myCard}
        </div>

        {/* footer */}
        <div style={{
          textAlign: 'center', marginTop: 14, padding: '10px',
          border: '1px dashed #ddd',
        }}>
          <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
            {t.footerTip}
          </p>
        </div>
      </div>

      <style>{`
        .cards-container {
          flex-direction: row !important;
        }
        @media (max-width: 640px) {
          .cards-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ───────── Main App ───────── */
export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('challenge-lang')
    return saved || 'ko'
  })

  useEffect(() => {
    localStorage.setItem('challenge-lang', lang)
  }, [lang])

  const { session, loading: authLoading, signInWithEmail, signOut } = useAuth()
  const { challenge, loading: challengeLoading, mySide, createChallenge, toggleDay, updateGoal } = useChallenge(session)

  if (!session) {
    return <LoginScreen onLogin={signInWithEmail} loading={authLoading} lang={lang} setLang={setLang} />
  }

  if (challengeLoading) {
    const t = getTranslations(lang)
    return (
      <div style={styles.centered}>
        <LangToggle lang={lang} setLang={setLang} />
        <p style={{ color: '#999', fontSize: 15 }}>{t.loadingChallenge}</p>
      </div>
    )
  }

  if (!challenge) {
    return <SetupScreen myEmail={session.user.email} onCreate={createChallenge} lang={lang} setLang={setLang} />
  }

  return (
    <ChallengeScreen
      challenge={challenge} mySide={mySide}
      onToggle={toggleDay} onUpdateGoal={updateGoal}
      lang={lang} setLang={setLang}
    />
  )
}

/* ───────── Shared Styles ───────── */
const styles = {
  centered: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 30, fontWeight: 700, color: '#222',
  },
  card: {
    background: '#fff', padding: '24px 20px',
    border: '1.5px solid #222',
  },
  label: {
    fontSize: 14, fontWeight: 700, marginBottom: 6, display: 'block', color: '#222',
  },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 0,
    border: '1px solid #ccc', fontSize: 15, outline: 'none',
    boxSizing: 'border-box', background: '#fff',
    fontFamily: "'Gaegu', sans-serif",
  },
  primaryBtn: {
    width: '100%', padding: '12px', borderRadius: 0,
    border: '1.5px solid #222', cursor: 'pointer',
    background: '#222', color: '#fff', fontSize: 16, fontWeight: 700,
    fontFamily: "'Gaegu', sans-serif", transition: 'all 0.2s',
  },
  textBtn: {
    background: 'none', border: 'none', color: '#555',
    fontSize: 14, cursor: 'pointer', fontWeight: 700,
    textDecoration: 'underline',
  },
}
