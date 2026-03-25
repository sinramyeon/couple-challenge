import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth, useChallenge } from './lib/hooks'
import { getTranslations } from './lib/i18n'
import ChallengeCard from './components/ChallengeCard'
import EncouragementBanner from './components/EncouragementBanner'
import { Confetti, CelebrationModal } from './components/Celebration'
import MilestoneToast, { CheckInPop } from './components/MilestoneToast'

const MILESTONE_THRESHOLDS = [1, 3, 5, 7, 10, 15, 20, 25, 28, 30]

/* ───────── Top Bar ───────── */
function TopBar({ lang, setLang, onSignOut, onNewChallenge, t, showActions }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#fff', borderBottom: '1.5px solid #222',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', height: 48,
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#222', fontFamily: "'Gaegu', sans-serif" }}>
        {t.title}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          style={{
            background: '#fff', border: '1.5px solid #222', borderRadius: 0,
            padding: '4px 12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            color: '#222', fontFamily: "'Gaegu', sans-serif",
          }}
        >
          {lang === 'ko' ? 'EN' : '한국어'}
        </button>

        {/* Menu button */}
        {showActions && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: menuOpen ? '#222' : '#fff',
                border: '1.5px solid #222', borderRadius: 0,
                padding: '4px 12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                color: menuOpen ? '#fff' : '#222', fontFamily: "'Gaegu', sans-serif",
              }}
            >
              {t.settings} ▾
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                />
                {/* Dropdown */}
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  background: '#fff', border: '1.5px solid #222',
                  minWidth: 180, zIndex: 99,
                  boxShadow: '3px 3px 0 #222',
                }}>
                  {onNewChallenge && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        if (window.confirm(t.newChallengeConfirm)) {
                          onNewChallenge()
                        }
                      }}
                      style={menuItemStyle}
                    >
                      {t.newChallengBtn}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onSignOut()
                    }}
                    style={{ ...menuItemStyle, color: '#c00' }}
                  >
                    {t.logout}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const menuItemStyle = {
  display: 'block', width: '100%', textAlign: 'left',
  background: 'none', border: 'none', borderBottom: '1px dashed #ddd',
  padding: '12px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  color: '#222', fontFamily: "'Gaegu', sans-serif",
}

/* ───────── Login Screen ───────── */
function LoginScreen({ onGoogleLogin, onEmailLogin, loading: authLoading, lang, setLang }) {
  const t = getTranslations(lang)
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async () => {
    if (!email.includes('@')) { setError(t.invalidEmail); return }
    setLoading(true); setError('')
    const { error: err } = await onEmailLogin(email)
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  if (authLoading) {
    return (
      <div style={styles.page}>
        <TopBar lang={lang} setLang={setLang} onSignOut={() => {}} t={t} showActions={false} />
        <div style={styles.centered}>
          <p style={{ color: '#888', fontSize: 18, fontWeight: 700 }}>{t.loading}</p>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div style={styles.page}>
        <TopBar lang={lang} setLang={setLang} onSignOut={() => {}} t={t} showActions={false} />
        <div style={styles.centered}>
          <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#222', margin: '0 0 14px' }}>
              {t.checkEmail}
            </h2>
            <p style={{ color: '#555', fontSize: 17, lineHeight: 1.6, fontWeight: 500 }}>
              <strong style={{ color: '#222', fontSize: 18 }}>{email}</strong>{t.sentTo}<br/>
              {t.clickLink}
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{ ...styles.textBtn, marginTop: 24, fontSize: 16 }}
            >
              {t.tryOther} →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <TopBar lang={lang} setLang={setLang} onSignOut={() => {}} t={t} showActions={false} />
      <div style={styles.centered}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/bear.png" alt="" style={{ width: 64, height: 64, marginBottom: 8, opacity: 0.7 }} />
            <h1 style={{ ...styles.title, fontSize: 34 }}>{t.title}</h1>
            <p style={{ color: '#888', fontSize: 17, fontWeight: 500 }}>{t.subtitle}</p>
          </div>

          <div style={styles.card}>
            <p style={{ fontSize: 16, color: '#888', marginBottom: 18, textAlign: 'center', fontWeight: 500 }}>
              {t.loginPrompt}
            </p>

            {/* Google Login - primary */}
            <button
              onClick={onGoogleLogin}
              style={{
                width: '100%', padding: '14px', borderRadius: 0,
                border: '2px solid #222', cursor: 'pointer',
                background: '#fff', color: '#222', fontSize: 18, fontWeight: 700,
                fontFamily: "'Gaegu', sans-serif", transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {t.googleLogin}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#ddd' }} />
              <span style={{ fontSize: 13, color: '#aaa', fontWeight: 700 }}>{t.orEmail}</span>
              <div style={{ flex: 1, height: 1, background: '#ddd' }} />
            </div>

            {/* Email login - secondary */}
            {!showEmail ? (
              <button
                onClick={() => setShowEmail(true)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 0,
                  border: '1.5px dashed #bbb', cursor: 'pointer',
                  background: '#fafafa', color: '#666', fontSize: 15, fontWeight: 700,
                  fontFamily: "'Gaegu', sans-serif",
                }}
              >
                {t.sendLink}
              </button>
            ) : (
              <>
                <input
                  type="email" placeholder={t.emailPlaceholder} value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                  style={styles.input}
                  autoFocus
                />
                {error && <p style={{ color: '#c00', fontSize: 14, fontWeight: 700, margin: '10px 0 0' }}>{error}</p>}
                <button
                  onClick={handleEmailSubmit} disabled={loading}
                  style={{ ...styles.primaryBtn, marginTop: 10, opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? t.sending : t.sendLink}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── Setup Screen ───────── */
function SetupScreen({ myEmail, onCreate, lang, setLang, onSignOut }) {
  const t = getTranslations(lang)
  const [partnerName, setPartnerName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [myName, setMyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [copied, setCopied] = useState(false)

  const canStart = myName.trim() && partnerName.trim() && partnerEmail.includes('@')

  const handleCreate = async () => {
    setLoading(true)
    const challenge = await onCreate({
      name1: myName.trim(), email1: myEmail,
      name2: partnerName.trim(), email2: partnerEmail.trim(),
    })
    if (challenge) {
      setSentEmail(partnerEmail.trim())
      setCreated(true)
    }
    setLoading(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div style={styles.page}>
        <TopBar lang={lang} setLang={setLang} onSignOut={onSignOut} t={t} showActions={false} />
        <div style={styles.centered}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222', margin: '0 0 14px' }}>
              {t.challengeCreated}
            </h2>
            <p style={{ color: '#444', fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>
              {t.partnerInstructions(sentEmail)}
            </p>

            {/* Copy link button */}
            <button
              onClick={handleCopyLink}
              style={{
                margin: '16px auto', padding: '12px 24px', borderRadius: 0,
                border: '2px solid #222', cursor: 'pointer',
                background: copied ? '#222' : '#fff',
                color: copied ? '#fff' : '#222',
                fontSize: 16, fontWeight: 700,
                fontFamily: "'Gaegu', sans-serif", transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {copied ? '✓ ' : '📋 '}{copied ? t.linkCopied : t.copyLink}
            </button>

            <p style={{ color: '#777', fontSize: 15, lineHeight: 1.5, marginTop: 12, fontWeight: 500 }}>
              {t.partnerInstructionsDesc}
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{ ...styles.primaryBtn, marginTop: 20, maxWidth: 300, margin: '20px auto 0' }}
            >
              {t.goToChallenge}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <TopBar lang={lang} setLang={setLang} onSignOut={onSignOut} t={t} showActions={true} onNewChallenge={null} />
      <div style={styles.centered}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ ...styles.title, fontSize: 28 }}>{t.newChallenge}</h1>
            <p style={{ color: '#888', fontSize: 16, fontWeight: 500 }}>{t.invitePartner}</p>
          </div>

          <div style={styles.card}>
            <div style={{ marginBottom: 22 }}>
              <label style={styles.label}>{t.me}</label>
              <input type="text" placeholder={t.myName} value={myName}
                onChange={e => setMyName(e.target.value)} style={styles.input} />
              <div style={{
                padding: '10px 14px', background: '#fafafa', color: '#555', fontSize: 15, fontWeight: 500,
                marginTop: 8, border: '1.5px dashed #ddd',
              }}>{myEmail}</div>
            </div>

            <div style={{ borderTop: '1.5px dashed #ddd', margin: '4px 0 22px' }} />

            <div style={{ marginBottom: 22 }}>
              <label style={styles.label}>{t.partner}</label>
              <input type="text" placeholder={t.partnerName} value={partnerName}
                onChange={e => setPartnerName(e.target.value)} style={styles.input} />
              <input type="email" placeholder={t.partnerEmail} value={partnerEmail}
                onChange={e => setPartnerEmail(e.target.value)}
                style={{ ...styles.input, marginTop: 8 }} />
            </div>

            <p style={{ fontSize: 14, color: '#aaa', fontWeight: 500, textAlign: 'center', marginBottom: 18 }}>
              {t.goalLater}
            </p>

            <button onClick={handleCreate} disabled={!canStart || loading}
              style={{ ...styles.primaryBtn, opacity: (!canStart || loading) ? 0.5 : 1 }}>
              {loading ? t.creating : t.startChallenge}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── Challenge Screen ───────── */
function ChallengeScreen({ challenge, mySide, onToggle, onUpdateGoal, lang, setLang, onSignOut, onNewChallenge }) {
  const t = getTranslations(lang)
  const otherSide = mySide === 'a' ? 'b' : 'a'
  const [celebration, setCelebration] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState(null)
  const [sparkle, setSparkle] = useState(null)
  const [partnerToast, setPartnerToast] = useState(null)
  const prevMyCount = useRef(0)
  const prevOtherCount = useRef(0)
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

  // Partner check-in notification
  useEffect(() => {
    if (otherCount > prevOtherCount.current && prevOtherCount.current > 0) {
      const name = challenge[`name_${otherSide}`]
      setPartnerToast(t.partnerCheckedIn(name))
      const timer = setTimeout(() => setPartnerToast(null), 3000)
      return () => clearTimeout(timer)
    }
    prevOtherCount.current = otherCount
  }, [otherCount, challenge, otherSide, t])

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
    onGoalSave: (g) => onUpdateGoal(g),
    days: challenge[`days_${side}`],
    onToggle: (i) => onToggle(i),
    isOwner: side === mySide,
    startDate: challenge.created_at,
    t,
  })

  return (
    <div style={styles.page}>
      <TopBar
        lang={lang} setLang={setLang}
        onSignOut={onSignOut} onNewChallenge={onNewChallenge}
        t={t} showActions={true}
      />

      <div style={{ padding: '64px 16px 24px', minHeight: '100vh' }}>
        <Confetti show={showConfetti} />
        <MilestoneToast milestone={milestone} onDone={clearMilestone} />
        {sparkle && <CheckInPop key={sparkle.id} show={true} x={sparkle.x} y={sparkle.y} color={sparkle.color} />}
        {celebration && (
          <CelebrationModal name={celebration} t={t}
            onClose={() => { setCelebration(null); setTimeout(() => setShowConfetti(false), 500) }} />
        )}

        {/* Partner check-in toast */}
        {partnerToast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9990, background: '#222', color: '#fff',
            padding: '10px 20px', border: '2px solid #222',
            fontSize: 15, fontWeight: 700, fontFamily: "'Gaegu', sans-serif",
            animation: 'slideDown 0.3s ease-out',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}>
            {partnerToast}
          </div>
        )}

        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {/* Sub-header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{ color: '#999', fontSize: 15, fontWeight: 700, margin: 0 }}>
              {t.daysRemaining(Math.max(0, 30 - Math.max(countA, countB)))}
            </p>
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

          {/* Footer tip */}
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

/* ───────── Main App ───────── */
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('challenge-lang') || 'ko')
  useEffect(() => { localStorage.setItem('challenge-lang', lang) }, [lang])

  const { session, loading: authLoading, signInWithGoogle, signInWithEmail, signOut } = useAuth()
  const { challenge, loading: challengeLoading, mySide, createChallenge, toggleDay, updateGoal, deleteChallenge } = useChallenge(session)

  const handleNewChallenge = async () => {
    await deleteChallenge()
  }

  if (!session) {
    return <LoginScreen onGoogleLogin={signInWithGoogle} onEmailLogin={signInWithEmail} loading={authLoading} lang={lang} setLang={setLang} />
  }

  if (challengeLoading) {
    const t = getTranslations(lang)
    return (
      <div style={styles.page}>
        <TopBar lang={lang} setLang={setLang} onSignOut={signOut} t={t} showActions={false} />
        <div style={styles.centered}>
          <p style={{ color: '#888', fontSize: 18, fontWeight: 700 }}>{t.loadingChallenge}</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <SetupScreen
        myEmail={session.user.email} onCreate={createChallenge}
        onSignOut={signOut} lang={lang} setLang={setLang}
      />
    )
  }

  return (
    <ChallengeScreen
      challenge={challenge} mySide={mySide}
      onToggle={toggleDay} onUpdateGoal={updateGoal}
      onSignOut={signOut} onNewChallenge={handleNewChallenge}
      lang={lang} setLang={setLang}
    />
  )
}

/* ───────── Shared Styles ───────── */
const styles = {
  page: {
    minHeight: '100vh', background: '#fff',
  },
  centered: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 32, fontWeight: 700, color: '#222',
  },
  card: {
    background: '#fff', padding: '26px 22px',
    border: '2px solid #222',
  },
  label: {
    fontSize: 16, fontWeight: 700, marginBottom: 8, display: 'block', color: '#222',
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: 0,
    border: '1.5px solid #bbb', fontSize: 16, outline: 'none',
    boxSizing: 'border-box', background: '#fff', fontWeight: 500,
    fontFamily: "'Gaegu', sans-serif",
  },
  primaryBtn: {
    width: '100%', padding: '14px', borderRadius: 0,
    border: '2px solid #222', cursor: 'pointer',
    background: '#222', color: '#fff', fontSize: 18, fontWeight: 700,
    fontFamily: "'Gaegu', sans-serif", transition: 'all 0.2s',
  },
  textBtn: {
    background: 'none', border: 'none', color: '#444',
    fontSize: 15, cursor: 'pointer', fontWeight: 700,
    textDecoration: 'underline',
  },
}
