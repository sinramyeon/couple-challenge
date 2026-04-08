/*
  WashiTape — decorative tape strip that can be placed on cards
  to give a scrapbook / journal feel. Rotates slightly for
  a hand-placed look.
*/

const TAPE_PRESETS = [
    { bg: '#FFD4D4', stripe: '#FFB8B8', rotation: -2 },
    { bg: '#D4F0FF', stripe: '#B8E4FF', rotation: 1.5 },
    { bg: '#FFF3D4', stripe: '#FFE8B0', rotation: -1 },
    { bg: '#E8D4FF', stripe: '#D4B8FF', rotation: 2 },
    { bg: '#D4FFE8', stripe: '#B8FFD4', rotation: -1.5 },
    { bg: '#FFE4D4', stripe: '#FFD0B8', rotation: 1 },
  ]
  
  export default function WashiTape({
    index = 0,
    width = 120,
    position = 'top-right', // top-left, top-right, top-center
    style = {},
  }) {
    const preset = TAPE_PRESETS[index % TAPE_PRESETS.length]
  
    const positionStyles = {
      'top-left': { top: -8, left: -10, transformOrigin: 'center center' },
      'top-right': { top: -8, right: -10, transformOrigin: 'center center' },
      'top-center': { top: -8, left: '50%', marginLeft: -width / 2, transformOrigin: 'center center' },
      'bottom-left': { bottom: -8, left: -10, transformOrigin: 'center center' },
      'bottom-right': { bottom: -8, right: -10, transformOrigin: 'center center' },
    }
  
    return (
      <div style={{
        position: 'absolute',
        ...positionStyles[position],
        width,
        height: 22,
        background: preset.bg,
        opacity: 0.85,
        transform: `rotate(${preset.rotation}deg)`,
        zIndex: 10,
        overflow: 'hidden',
        // Torn edge effect
        clipPath: `polygon(
          2% 0%, 8% 3%, 15% 0%, 22% 2%, 30% 0%, 38% 3%,
          45% 0%, 52% 2%, 60% 0%, 68% 3%, 75% 0%, 82% 2%,
          90% 0%, 95% 3%, 100% 0%, 100% 100%,
          95% 97%, 90% 100%, 82% 98%, 75% 100%, 68% 97%,
          60% 100%, 52% 98%, 45% 100%, 38% 97%, 30% 100%,
          22% 98%, 15% 100%, 8% 97%, 2% 100%, 0% 100%, 0% 0%
        )`,
        ...style,
      }}>
        {/* Diagonal stripes pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent, transparent 3px,
            ${preset.stripe} 3px, ${preset.stripe} 5px
          )`,
          opacity: 0.5,
        }} />
      </div>
    )
  }
  
  /*
    StickerDecoration — small sticker-like element for milestones
  */
  export function Sticker({ emoji, size = 28, rotation = 0, style = {} }) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        width: size, height: size,
        fontSize: size * 0.65,
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.1))',
        userSelect: 'none',
        ...style,
      }}>
        {emoji}
      </span>
    )
  }
  
  /*
    HandDrawnBorder — applies a slightly wobbly border to children
    to mimic hand-drawn lines
  */
  export function HandDrawnCard({ children, style = {}, tapeIndex, tapePosition }) {
    return (
      <div style={{
        position: 'relative',
        background: '#fff',
        padding: '22px 20px 18px',
        // Slightly irregular border using clip-path
        border: '1.8px solid #333',
        borderRadius: 2,
        // Subtle shadow like paper on paper
        boxShadow: '2px 2px 0 rgba(0,0,0,0.06), -1px -1px 0 rgba(0,0,0,0.02)',
        ...style,
      }}>
        {tapeIndex !== undefined && (
          <WashiTape index={tapeIndex} position={tapePosition || 'top-right'} />
        )}
        {children}
      </div>
    )
  }