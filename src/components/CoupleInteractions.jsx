import { useState, useEffect } from 'react'

/*
  CoupleInteractions — floating action bar between the two cards.
  Contains: nudge button, emoji reactions, couple sync indicator.
  Shows real-time partner activity.
*/

// ─── Nudge Button ───
export function NudgeButton({ onNudge, cooldown, t }) {
  const [sent, setSent] = useState(false)

  const handleNudge = () => {
    if (sent || cooldown) return
    onNudge()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <button
        onClick={handleNudge}
        disabled={sent || cooldown}
        title={t.nudgeDesc}
        style={{
          background: sent ? '#333' : '#fff',
          color: sent ? '#fff' : '#333',
          border: '1.5px solid #333',
          padding: '6px 14px',
          fontSize: 14, fontWeight: 700, cursor: sent ? 'default' : 'pointer',
          fontFamily: "'JejuGothic', sans-serif",
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: 4,
          boxShadow: sent ? 'none' : '2px 2px 0 rgba(0,0,0,0.08)',
          opacity: cooldown ? 0.5 : 1,
        }}
      >
        {sent ? '✓ ' : '👉 '}{sent ? t.nudgeSent : t.sendNudge}
      </button>
      <span style={{
        fontSize: 10, color: '#aaa', fontWeight: 600,
        fontFamily: "'JejuGothic', sans-serif",
      }}>{t.nudgeDesc}</span>
    </div>
  )
}

// ─── Reaction Picker ───
export function ReactionPicker({ onReact, t }) {
  const [open, setOpen] = useState(false)
  const [sentEmoji, setSentEmoji] = useState(null)

  const handleReact = (emoji) => {
    onReact(emoji)
    setSentEmoji(emoji)
    setOpen(false)
    setTimeout(() => setSentEmoji(null), 2000)
  }

  const reactions = t.reactions || ['❤️', '🔥', '👏', '😍', '💪', '🌟']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        title={t.reactDesc}
        style={{
          background: sentEmoji ? '#f0f0f0' : '#fff',
          border: '1.5px solid #333',
          padding: '6px 14px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'JejuGothic', sans-serif",
          display: 'flex', alignItems: 'center', gap: 4,
          boxShadow: '2px 2px 0 rgba(0,0,0,0.08)',
          transition: 'all 0.2s',
        }}
      >
        {sentEmoji || '💝'} {sentEmoji ? t.reactionSent : t.react}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
          <div style={{
            position: 'absolute', bottom: '100%', left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            background: '#fff',
            border: '1.5px solid #333',
            padding: '8px 10px',
            display: 'flex', gap: 4,
            zIndex: 51,
            boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
            animation: 'toastBounce 0.3s ease',
          }}>
            {reactions.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleReact(emoji)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 22, cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
      </div>
      <span style={{
        fontSize: 10, color: '#aaa', fontWeight: 600,
        fontFamily: "'JejuGothic', sans-serif",
      }}>{t.reactDesc}</span>
    </div>
  )
}

// ─── Couple Sync Indicator ───
export function CoupleSyncBadge({ myCheckedToday, partnerCheckedToday, t }) {
  const bothChecked = myCheckedToday && partnerCheckedToday

  if (!bothChecked) return null

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#f5f5f5',
      border: '1.5px solid #ccc',
      padding: '4px 12px',
      fontSize: 13, fontWeight: 700, color: '#333',
      fontFamily: "'JejuGothic', sans-serif",
      animation: 'badgePop 0.5s ease',
    }}>
      💕 {t.lang === 'ko' ? '오늘 둘 다 체크인!' : 'Both checked in today!'}
    </div>
  )
}

// ─── Incoming Notification Toast ───
export function InteractionToast({ message, emoji, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed', top: 60, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9990,
      background: '#fff',
      border: '2px solid #333',
      padding: '10px 20px',
      fontFamily: "'JejuGothic', sans-serif",
      fontSize: 15, fontWeight: 700, color: '#333',
      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
      animation: 'toastBounce 0.4s ease',
      display: 'flex', alignItems: 'center', gap: 8,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      {message}
    </div>
  )
}

// ─── Couple Action Bar (assembles all interactions) ───
export default function CoupleActionBar({
  onNudge,
  onReact,
  nudgeCooldown,
  myCheckedToday,
  partnerCheckedToday,
  t,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, flexWrap: 'wrap',
      padding: '10px 0',
      marginBottom: 8,
    }}>
      <NudgeButton onNudge={onNudge} cooldown={nudgeCooldown} t={t} />
      <ReactionPicker onReact={onReact} t={t} />
      <CoupleSyncBadge
        myCheckedToday={myCheckedToday}
        partnerCheckedToday={partnerCheckedToday}
        t={t}
      />
    </div>
  )
}