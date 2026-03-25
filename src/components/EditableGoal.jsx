import { useState, useEffect, useRef } from 'react'

export default function EditableGoal({ goal, onSave, isOwner, t }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(goal || '')
  const inputRef = useRef(null)
  const savingRef = useRef(false)

  useEffect(() => { setDraft(goal || '') }, [goal])
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus() }, [editing])

  const save = () => {
    if (savingRef.current) return
    savingRef.current = true
    onSave(draft)
    setEditing(false)
    setTimeout(() => { savingRef.current = false }, 100)
  }

  const baseStyle = {
    background: '#fafafa', borderRadius: 0,
    padding: '14px 16px', marginBottom: 16, fontSize: 20,
    display: 'flex', alignItems: 'center', gap: 10,
    border: '1.5px dashed #ccc',
    minHeight: 54,
  }

  if (!isOwner) {
    return (
      <div style={baseStyle}>
        <span style={{
          fontWeight: 700,
          color: goal ? '#333' : '#bbb',
          fontStyle: goal ? 'normal' : 'italic',
          fontSize: goal ? 20 : 16,
        }}>
          {goal || t.noGoalYet}
        </span>
      </div>
    )
  }

  if (editing) {
    return (
      <div style={{ ...baseStyle, border: '2px solid #222' }}>
        <input
          ref={inputRef} type="text" value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') { setDraft(goal || ''); setEditing(false) }
          }}
          onBlur={save}
          placeholder={t.goalPlaceholder}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontSize: 20, outline: 'none', color: '#222', fontWeight: 700,
            fontFamily: "'Gaegu', sans-serif",
          }}
        />
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={save}
          style={{
            background: '#222', color: '#fff', border: 'none',
            borderRadius: 2, padding: '5px 14px', fontSize: 14,
            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: "'Gaegu', sans-serif",
          }}
        >
          {t.save}
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      style={{ ...baseStyle, cursor: 'pointer', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#888'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#ccc'}
    >
      <span style={{ fontWeight: 700, color: goal ? '#333' : '#bbb', flex: 1, fontSize: goal ? 20 : 16 }}>
        {goal || t.setGoal}
      </span>
      <span style={{ fontSize: 16, color: '#bbb' }}>✏️</span>
    </div>
  )
}
