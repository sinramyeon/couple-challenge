import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth, useChallenge } from './lib/hooks'
import { THEMES, EMOJIS } from './lib/constants'
import BunnyFace from './components/BunnyFace'
import ChallengeCard from './components/ChallengeCard'
import EncouragementBanner from './components/EncouragementBanner'
import { Confetti, CelebrationModal } from './components/Celebration'

/* ───────── Login Screen ───────── */
function LoginScreen({ onLogin, loading: authLoading }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.includes('@')) { setError('올바른 이메일을 입력해주세요'); return }
    setLoading(true); setError('')
    const { error: err } = await onLogin(email)
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  if (authLoading) {
    return (
      <div style={styles.centered}>
        <div style={{ animation: 'spin 1s linear infinite', fontSize: 32, marginBottom: 12 }}>🐰</div>
        <p style={{ color: '#aaa', fontSize: 14 }}>로딩 중...</p>
      </div>
    )
  }

  if (sent) {
    return (
      <div style={styles.centered}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <BunnyFace mood="happy" size={48} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#8B6AAE', margin: '12px 0 8px' }}>
            메일을 확인해주세요!
          </h2>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: '#5A8AAE' }}>{email}</strong>로<br/>
            로그인 링크를 보냈어요.<br/>
            메일함에서 링크를 클릭하면 바로 시작!
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            style={{ ...styles.textBtn, marginTop: 20 }}
          >
            다른 이메일로 시도 →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.centered}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            <BunnyFace mood="happy" size={48} />
            <BunnyFace mood="happy" size={48} />
          </div>
          <h1 style={styles.title}>30일 챌린지</h1>
          <p style={{ color: '#aaa', fontSize: 14 }}>둘이서 함께하는 30일 도전 🌱</p>
        </div>

        <div style={styles.card}>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 16, textAlign: 'center' }}>
            이메일로 간편하게 시작하세요
          </p>
          <input
            type="email" placeholder="이메일 주소" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={styles.input}
          />
          {error && <p style={{ color: '#e05050', fontSize: 12, margin: '8px 0 0' }}>{error}</p>}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{ ...styles.primaryBtn, marginTop: 12, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '전송 중...' : '로그인 링크 받기 ✉️'}
          </button>
        </div>
        <p style={{ color: '#ccc', fontSize: 11, marginTop: 16, textAlign: 'center' }}>
          가입 없이 이메일만으로 로그인
        </p>
      </div>
    </div>
  )
}

/* ───────── Setup Screen ───────── */
function SetupScreen({ myEmail, onCreate }) {
  const [partnerName, setPartnerName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [myName, setMyName] = useState('')
  const [loading, setLoading] = useState(false)

  const canStart = myName.trim() && partnerName.trim() && partnerEmail.includes('@')

  const handleCreate = async () => {
    setLoading(true)
    await onCreate({
      name1: myName.trim(),
      email1: myEmail,
      name2: partnerName.trim(),
      email2: partnerEmail.trim(),
    })
    setLoading(false)
  }

  return (
    <div style={styles.centered}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <BunnyFace mood="happy" size={44} />
          <h1 style={{ ...styles.title, fontSize: 24, marginTop: 8 }}>새 챌린지 만들기</h1>
          <p style={{ color: '#aaa', fontSize: 13 }}>함께할 파트너를 초대하세요</p>
        </div>

        <div style={styles.card}>
          {/* Me */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...styles.label, color: '#C4A0E0' }}>🐰 나</label>
            <input
              type="text" placeholder="내 이름" value={myName}
              onChange={e => setMyName(e.target.value)}
              style={{ ...styles.input, borderColor: '#e8ddf0' }}
            />
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: '#f8f4fc', color: '#8B6AAE', fontSize: 13,
              marginTop: 8,
            }}>
              {myEmail}
            </div>
          </div>

          <div style={{
            height: 1, background: 'linear-gradient(90deg, #e8ddf0, #d5e8f5)',
            margin: '4px 0 20px',
          }} />

          {/* Partner */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...styles.label, color: '#87BEE0' }}>🐻 파트너</label>
            <input
              type="text" placeholder="파트너 이름" value={partnerName}
              onChange={e => setPartnerName(e.target.value)}
              style={{ ...styles.input, borderColor: '#d5e0f0' }}
            />
            <input
              type="email" placeholder="파트너 이메일" value={partnerEmail}
              onChange={e => setPartnerEmail(e.target.value)}
              style={{ ...styles.input, borderColor: '#d5e0f0', marginTop: 8 }}
            />
          </div>

          <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginBottom: 16 }}>
            🎯 목표는 각자 나중에 설정할 수 있어요
          </p>

          <button
            onClick={handleCreate} disabled={!canStart || loading}
            style={{ ...styles.primaryBtn, opacity: (!canStart || loading) ? 0.5 : 1 }}
          >
            {loading ? '생성 중...' : '챌린지 시작하기! 🚀'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── Challenge Screen ───────── */
function ChallengeScreen({ challenge, mySide, onToggle, onUpdateGoal }) {
  const [order, setOrder] = useState([mySide, mySide === 'a' ? 'b' : 'a'])
  const [celebration, setCelebration] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const prevCounts = useRef({ a: 0, b: 0 })

  // Watch for completion
  useEffect(() => {
    const countA = challenge.days_a.filter(Boolean).length
    const countB = challenge.days_b.filter(Boolean).length

    if (countA === 30 && prevCounts.current.a < 30) {
      setTimeout(() => { setCelebration(challenge.name_a); setShowConfetti(true) }, 400)
    }
    if (countB === 30 && prevCounts.current.b < 30) {
      setTimeout(() => { setCelebration(challenge.name_b); setShowConfetti(true) }, 400)
    }

    prevCounts.current = { a: countA, b: countB }
  }, [challenge])

  const countA = challenge.days_a.filter(Boolean).length
  const countB = challenge.days_b.filter(Boolean).length
  const counts = { a: countA, b: countB }

  const topSide = order[0]
  const bottomSide = order[1]

  const cardProps = (side) => ({
    label: challenge[`name_${side}`],
    emoji: EMOJIS[side],
    goal: challenge[`goal_${side}`],
    onGoalSave: (g) => onUpdateGoal(g),
    days: challenge[`days_${side}`],
    onToggle: (i) => onToggle(i),
    theme: THEMES[side],
    isOwner: side === mySide,
  })

  return (
    <div style={{ padding: '24px 16px', minHeight: '100vh' }}>
      <Confetti show={showConfetti} />
      {celebration && (
        <CelebrationModal
          name={celebration}
          onClose={() => { setCelebration(null); setTimeout(() => setShowConfetti(false), 500) }}
        />
      )}

      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <BunnyFace mood={countA + countB > 40 ? 'cheer' : 'happy'} size={30} />
            <BunnyFace mood={countA + countB > 40 ? 'cheer' : 'happy'} size={30} />
          </div>
          <h1 style={{ ...styles.title, fontSize: 20, margin: 0 }}>30일 챌린지</h1>
          <p style={{ color: '#bbb', fontSize: 11, marginTop: 4 }}>
            D-{Math.max(0, 30 - Math.max(countA, countB))}
          </p>
        </div>

        {/* cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ChallengeCard
            {...cardProps(topSide)}
            encouragement={
              counts[topSide] < counts[bottomSide] - 2
                ? <EncouragementBanner
                    myCount={counts[topSide]} theirCount={counts[bottomSide]}
                    myName={challenge[`name_${topSide}`]}
                    theirName={challenge[`name_${bottomSide}`]}
                  />
                : null
            }
          />

          {/* swap */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0', position: 'relative', zIndex: 10 }}>
            <button
              onClick={() => setOrder(p => [p[1], p[0]])}
              style={{
                background: '#fff', border: '1.5px solid #e8e0f0', borderRadius: 50,
                width: 36, height: 36, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 15,
                transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#bbb',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'rotate(180deg)'
                e.currentTarget.style.background = '#f8f0ff'
                e.currentTarget.style.color = '#8B6AAE'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'rotate(0deg)'
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.color = '#bbb'
              }}
              title="순서 바꾸기"
            >↕</button>
          </div>

          <ChallengeCard
            {...cardProps(bottomSide)}
            encouragement={
              counts[bottomSide] < counts[topSide] - 2
                ? <EncouragementBanner
                    myCount={counts[bottomSide]} theirCount={counts[topSide]}
                    myName={challenge[`name_${bottomSide}`]}
                    theirName={challenge[`name_${topSide}`]}
                  />
                : null
            }
          />
        </div>

        {/* footer */}
        <div style={{
          textAlign: 'center', marginTop: 16, padding: '12px',
          background: '#fff', borderRadius: 14, border: '1.5px solid #f0e8f8',
        }}>
          <p style={{ fontSize: 12, color: '#ccc', margin: 0 }}>
            내 동그라미를 눌러 체크인 ✏️ · 🎯 클릭해서 목표 수정 · ↕ 순서 변경
          </p>
        </div>
      </div>
    </div>
  )
}

/* ───────── Main App ───────── */
export default function App() {
  const { session, loading: authLoading, signInWithEmail, signOut } = useAuth()
  const { challenge, loading: challengeLoading, mySide, createChallenge, toggleDay, updateGoal } = useChallenge(session)

  // Not logged in
  if (!session) {
    return <LoginScreen onLogin={signInWithEmail} loading={authLoading} />
  }

  // Loading challenge
  if (challengeLoading) {
    return (
      <div style={styles.centered}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'megaFloat 2s ease-in-out infinite' }}>
            <BunnyFace mood="happy" size={48} />
          </div>
          <p style={{ color: '#aaa', fontSize: 14, marginTop: 12 }}>챌린지 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // No active challenge → create one
  if (!challenge) {
    return (
      <SetupScreen
        myEmail={session.user.email}
        onCreate={createChallenge}
      />
    )
  }

  // Active challenge
  return (
    <ChallengeScreen
      challenge={challenge}
      mySide={mySide}
      onToggle={toggleDay}
      onUpdateGoal={updateGoal}
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
    fontSize: 30, fontWeight: 800,
    background: 'linear-gradient(135deg, #C4A0E0, #87BEE0)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  card: {
    background: '#fff', borderRadius: 20, padding: '28px 24px',
    border: '2px solid #f0e8f8',
  },
  label: {
    fontSize: 12, fontWeight: 700, marginBottom: 6, display: 'block',
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid #e8ddf0', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Pretendard Variable', sans-serif",
  },
  primaryBtn: {
    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #C4A0E0, #87BEE0)',
    color: '#fff', fontSize: 16, fontWeight: 700,
    fontFamily: "'Pretendard Variable', sans-serif",
    transition: 'all 0.2s',
  },
  textBtn: {
    background: 'none', border: 'none', color: '#8B6AAE',
    fontSize: 13, cursor: 'pointer', fontWeight: 600,
  },
}
