import { useState, useEffect, useRef } from 'react'
import BunnyFace from './BunnyFace'
import { getEncouragement } from '../lib/constants'

export default function EncouragementBanner({ myCount, theirCount, myName, theirName }) {
  const [msg, setMsg] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const prevKey = useRef('')

  useEffect(() => {
    const gap = theirCount - myCount
    const key = `${gap}`
    if (gap >= 3 && key !== prevKey.current) {
      const m = getEncouragement(myCount, theirCount)
      if (m) { setMsg(m); setDismissed(false) }
    }
    if (gap < 3) setMsg(null)
    prevKey.current = key
  }, [myCount, theirCount])

  if (!msg || dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff8e8, #fff0f5)',
      border: '1.5px solid #f0dca0', borderRadius: 14,
      padding: '12px 14px', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideDown 0.3s ease-out',
    }}>
      <BunnyFace mood="cheer" size={32} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, color: '#c0a040', fontWeight: 700, margin: '0 0 2px' }}>
          {theirName}이(가) {theirCount - myCount}일 앞서고 있어요!
        </p>
        <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.4 }}>{msg}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none', border: 'none', fontSize: 16,
          cursor: 'pointer', color: '#ccc', padding: 4, lineHeight: 1,
        }}
      >×</button>
    </div>
  )
}
