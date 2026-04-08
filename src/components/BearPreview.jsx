import { useState } from 'react'
import BearCircle from './BearCircle'

/*
  Preview page to see the bear grid before applying.
  Shows 30 bears in a 6x5 grid.
  Click any bear to toggle fill on/off.
*/
export default function BearPreview() {
  const [days, setDays] = useState(() => {
    // Pre-fill some to show both states
    const d = Array(30).fill(false)
    // Fill first 8 to show mixed state
    for (let i = 0; i < 8; i++) d[i] = true
    return d
  })

  const toggle = (i) => {
    setDays(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const filledCount = days.filter(Boolean).length

  return (
    <div style={{
      minHeight: '100vh', background: '#fff', padding: '40px 20px',
      fontFamily: "'JejuGothic', sans-serif",
    }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', color: '#222', marginBottom: 4 }}>
          Bear Grid Preview
        </h1>
        <p style={{ textAlign: 'center', color: '#999', fontSize: 14, marginBottom: 24 }}>
          Click bears to toggle filled/empty ({filledCount}/30)
        </p>

        <div style={{
          border: '1.5px solid #222', padding: '20px 16px',
          background: '#fff',
        }}>
          {/* Bear grid - 6 columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '6px 4px',
            justifyItems: 'center',
          }}>
            {days.map((filled, i) => (
              <BearCircle
                key={i}
                index={i}
                filled={filled}
                onClick={() => toggle(i)}
                size={52}
                disabled={false}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={() => setDays(Array(30).fill(false))}
            style={{
              background: '#fff', border: '1px solid #222', padding: '8px 16px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', marginRight: 8,
              fontFamily: "'JejuGothic', sans-serif",
            }}
          >
            Reset All
          </button>
          <button
            onClick={() => setDays(Array(30).fill(true))}
            style={{
              background: '#222', border: '1px solid #222', color: '#fff',
              padding: '8px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'JejuGothic', sans-serif",
            }}
          >
            Fill All
          </button>
        </div>
      </div>
    </div>
  )
}
