import { useState, useEffect, useRef } from 'react'

export default function EditableGoal({ goal, onSave, themeColor, isOwner }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(goal || '')
  const inputRef = useRef(null)

  useEffect(() => { setDraft(goal || '') }, [goal])
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus() }, [editing])

  if (!isOwner) {
    return (
      <div style={{
        background: themeColor.light + '44', borderRadius: 12,
        padding: '10px 14px', marginBottom: 16, fontSize: 14,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 13 }}>🎯</span>
        <span style={{
          fontWeight: 500,
          color: goal ? '#555' : '#bbb',
          fontStyle: goal ? 'normal' : 'italic',
        }}>
          {goal || '아직 목표를 설정하지 않았어요'}
        </span>
      </div>
    )
  }

  if (editing) {
    return (
      <div style={{
        background: themeColor.light + '66', borderRadius: 12,
        padding: '8px 10px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1.5px solid ${themeColor.color}44`,
      }}>
        <span style={{ fontSize: 13 }}>🎯</span>
        <input
          ref={inputRef} type="text" value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { onSave(draft); setEditing(false) }
            if (e.key === 'Escape') { setDraft(goal || ''); setEditing(false) }
          }}
          onBlur={() => { onSave(draft); setEditing(false) }}
          placeholder="30일 목표를 적어보세요..."
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontSize: 14, outline: 'none', color: '#555', fontWeight: 500,
            fontFamily: "'Pretendard Variable', sans-serif",
          }}
        />
        <button
          onClick={() => { onSave(draft); setEditing(false) }}
          style={{
            background: themeColor.color, color: '#fff', border: 'none',
            borderRadius: 8, padding: '4px 12px', fontSize: 12,
            fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: "'Pretendard Variable', sans-serif",
          }}
        >
          저장
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      style={{
        background: themeColor.light + '44', borderRadius: 12,
        padding: '10px 14px', marginBottom: 16, fontSize: 14,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = themeColor.light + '88'}
      onMouseLeave={e => e.currentTarget.style.background = themeColor.light + '44'}
    >
      <span style={{ fontSize: 13 }}>🎯</span>
      <span style={{ fontWeight: 500, color: goal ? '#555' : '#bbb', flex: 1 }}>
        {goal || '목표를 설정해주세요...'}
      </span>
      <span style={{ fontSize: 11, color: '#ccc' }}>✏️</span>
    </div>
  )
}
