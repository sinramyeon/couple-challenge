import { useState, useEffect, useRef } from 'react'
import { getEncouragement } from '../lib/i18n'

export default function EncouragementBanner({ myCount, theirCount, theirName, lang, t }) {
  const [msg, setMsg] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const prevKey = useRef('')

  useEffect(() => {
    const gap = theirCount - myCount
    const key = `${gap}`
    if (gap >= 3 && key !== prevKey.current) {
      const m = getEncouragement(myCount, theirCount, lang)
      if (m) { setMsg(m); setDismissed(false) }
    }
    if (gap < 3) setMsg(null)
    prevKey.current = key
  }, [myCount, theirCount, lang])

  if (!msg || dismissed) return null

  return (
    <div style={{
      background: '#fff', border: '1px dashed #ccc',
      borderRadius: 0, padding: '10px 12px', marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideDown 0.3s ease-out',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: '#999', fontWeight: 700, margin: '0 0 2px' }}>
          {t.ahead(theirName, theirCount - myCount)}
        </p>
        <p style={{ fontSize: 14, color: '#444', margin: 0, lineHeight: 1.4 }}>{msg}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none', border: 'none', fontSize: 14,
          cursor: 'pointer', color: '#ccc', padding: 4, lineHeight: 1,
        }}
      >×</button>
    </div>
  )
}
