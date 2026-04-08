import { useState, useEffect, useRef } from 'react'

/*
  DailyNote — lets each partner leave a short daily note + mood.
  Shows partner's note with a cute speech bubble style.
  Notes are stored in the challenge record (note_a / note_b fields).
*/

export default function DailyNote({
  myNote,
  partnerNote,
  partnerName,
  myMood,
  partnerMood,
  onSaveNote,
  onSaveMood,
  isOwner,
  t,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(myNote || '')
  const inputRef = useRef(null)

  useEffect(() => { setDraft(myNote || '') }, [myNote])
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const handleSave = () => {
    if (draft.trim() !== (myNote || '').trim()) {
      onSaveNote(draft.trim())
    }
    setEditing(false)
  }

  const moods = t.moods || []

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Partner's note (speech bubble) */}
      {partnerNote && (
        <div style={{
          background: '#f5f5f5',
          border: '1.5px solid #ddd',
          padding: '10px 14px',
          marginBottom: 10,
          position: 'relative',
          fontFamily: "'JejuGothic', sans-serif",
        }}>
          <div style={{ fontSize: 12, color: '#666', fontWeight: 700, marginBottom: 4 }}>
            {partnerMood && <span style={{ marginRight: 4 }}>{partnerMood}</span>}
            {partnerName}의 한마디
          </div>
          <div style={{ fontSize: 15, color: '#555', fontWeight: 500 }}>
            {partnerNote}
          </div>
          {/* Speech bubble triangle */}
          <div style={{
            position: 'absolute', top: -8, left: 20,
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #ddd',
          }} />
        </div>
      )}

      {/* My note section */}
      {isOwner && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Mood selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 12, color: '#999', fontWeight: 700,
              fontFamily: "'JejuGothic', sans-serif",
            }}>
              {t.todaysMood}
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              {moods.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => onSaveMood(mood.emoji)}
                  title={mood.label}
                  style={{
                    background: myMood === mood.emoji ? '#f0f0f0' : 'transparent',
                    border: myMood === mood.emoji ? '1.5px solid #333' : '1.5px solid transparent',
                    padding: '2px 4px',
                    cursor: 'pointer',
                    fontSize: 16,
                    transition: 'all 0.15s',
                    borderRadius: 2,
                  }}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Note input/display */}
          {editing ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
                placeholder={t.dailyNotePlaceholder}
                maxLength={80}
                style={{
                  flex: 1, padding: '8px 10px',
                  border: '1.5px solid #333',
                  fontSize: 14, fontWeight: 500,
                  fontFamily: "'JejuGothic', sans-serif",
                  background: '#fafafa',
                  outline: 'none',
                }}
              />
              <button onClick={handleSave} style={{
                padding: '8px 14px', background: '#333', color: '#fff',
                border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'JejuGothic', sans-serif",
              }}>
                {t.save}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                background: myNote ? '#fafafa' : 'transparent',
                border: '1.5px dashed #ddd',
                padding: '8px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 14, color: myNote ? '#555' : '#bbb',
                fontWeight: 500,
                fontFamily: "'JejuGothic', sans-serif",
              }}
            >
              {myMood && <span style={{ marginRight: 4 }}>{myMood}</span>}
              {myNote || t.dailyNotePlaceholder}
            </button>
          )}
        </div>
      )}
    </div>
  )
}