import { CRAYON_COLORS } from '../lib/skins'

const BADGE_THRESHOLDS = [1, 3, 5, 7, 10, 15, 20, 25, 28, 30]

export default function AchievementBadges({ filled, t }) {
  const milestones = t.milestones

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10,
      justifyContent: 'center',
    }}>
      {BADGE_THRESHOLDS.map((threshold, i) => {
        const reached = filled >= threshold
        const m = milestones[threshold]
        if (!m) return null

        return (
          <div
            key={threshold}
            title={reached ? `${m.text} — ${m.sub}` : `${threshold}일`}
            style={{
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: reached ? 16 : 11,
              border: `1.5px ${reached ? 'solid' : 'dashed'} ${reached ? '#222' : '#ddd'}`,
              background: reached ? '#fff' : '#fafafa',
              transition: 'all 0.3s',
              cursor: 'default',
              position: 'relative',
              ...(reached && filled === threshold ? {
                animation: 'badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              } : {}),
            }}
          >
            {reached ? m.icon : (
              <span style={{ color: '#ddd' }}>{threshold}</span>
            )}
            {/* Tiny sticker color dot */}
            {reached && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 6, height: 6, borderRadius: '50%',
                background: CRAYON_COLORS[i % CRAYON_COLORS.length],
                border: '0.5px solid #444',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
