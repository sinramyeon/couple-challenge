import CrayonCircle from './CrayonCircle'
import EditableGoal from './EditableGoal'
import BunnyFace from './BunnyFace'

export default function ChallengeCard({
  label, emoji, goal, onGoalSave, days, onToggle, theme, isOwner, encouragement,
}) {
  const filledCount = days.filter(Boolean).length
  const progress = Math.round((filledCount / 30) * 100)

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '24px 20px 20px',
      border: `2px solid ${isOwner ? theme.color + '55' : theme.light}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* progress bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, ${theme.color} ${progress}%, ${theme.light} ${progress}%)`,
        transition: 'background 0.4s',
      }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: theme.dark }}>{label}</span>
        {isOwner && (
          <span style={{
            fontSize: 10, background: theme.light, color: theme.dark,
            padding: '2px 8px', borderRadius: 10, fontWeight: 600,
          }}>나</span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <BunnyFace mood={filledCount >= 25 ? 'cheer' : filledCount > 0 ? 'happy' : 'neutral'} size={26} />
        </div>
      </div>

      {/* goal */}
      <EditableGoal goal={goal} onSave={onGoalSave} themeColor={theme} isOwner={isOwner} />

      {/* encouragement */}
      {encouragement}

      {/* grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 6, justifyItems: 'center', marginBottom: 16,
      }}>
        {days.map((filled, i) => (
          <CrayonCircle
            key={i} index={i} filled={filled}
            onClick={() => onToggle(i)} size={42}
            disabled={!isOwner}
          />
        ))}
      </div>

      {/* footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: 13, color: '#999',
      }}>
        <span>
          <span style={{ color: theme.dark, fontWeight: 700, fontSize: 20 }}>{filledCount}</span>
          <span style={{ color: '#bbb' }}> / 30일</span>
        </span>
        <span style={{
          background: filledCount === 30 ? 'linear-gradient(135deg, #d5f5e0, #e8ffd5)' : theme.light + '66',
          color: filledCount === 30 ? '#2d8a4e' : theme.dark,
          padding: '4px 14px', borderRadius: 20, fontWeight: 600, fontSize: 12,
        }}>
          {filledCount === 30 ? '🎉 완료!' : filledCount >= 20 ? `🔥 ${progress}%` : `${progress}%`}
        </span>
      </div>
    </div>
  )
}
