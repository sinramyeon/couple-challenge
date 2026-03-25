export default function BunnyFace({ mood = "happy", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <ellipse cx="13" cy="8" rx="5" ry="10" fill="#f5ede3" stroke="#ddd0c0" strokeWidth="1"/>
      <ellipse cx="27" cy="8" rx="5" ry="10" fill="#f5ede3" stroke="#ddd0c0" strokeWidth="1"/>
      <ellipse cx="13" cy="8" rx="3" ry="7" fill="#f0d5dc"/>
      <ellipse cx="27" cy="8" rx="3" ry="7" fill="#f0d5dc"/>
      <circle cx="20" cy="25" r="14" fill="#f5ede3" stroke="#ddd0c0" strokeWidth="1"/>
      <circle cx="15" cy="23" r="1.5" fill="#6b5e5e"/>
      <circle cx="25" cy="23" r="1.5" fill="#6b5e5e"/>
      {mood === "happy" ? (<>
        <path d="M17 28 Q20 31 23 28" fill="none" stroke="#6b5e5e" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="11" cy="27" r="2.5" fill="#f5c0c0" opacity="0.5"/>
        <circle cx="29" cy="27" r="2.5" fill="#f5c0c0" opacity="0.5"/>
      </>) : mood === "cheer" ? (<>
        <path d="M16 27 Q20 33 24 27" fill="#f5c0c0" stroke="#6b5e5e" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="11" cy="27" r="3" fill="#f5c0c0" opacity="0.6"/>
        <circle cx="29" cy="27" r="3" fill="#f5c0c0" opacity="0.6"/>
      </>) : (
        <path d="M17 29 Q20 27 23 29" fill="none" stroke="#6b5e5e" strokeWidth="1.2" strokeLinecap="round"/>
      )}
    </svg>
  )
}
