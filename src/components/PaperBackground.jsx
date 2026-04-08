import { THEMES } from '../lib/skins'

/*
  PaperBackground — renders a notebook/grid/dotted paper texture
  behind the main content. Uses CSS patterns, no images.
  Wraps children and provides the paper feel.
*/

export default function PaperBackground({ themeId = 'notebook', children, style = {} }) {
  const theme = THEMES[themeId] || THEMES.notebook

  const getPatternCSS = () => {
    const { lineColor, lineSpacing, type } = theme
    switch (type) {
      case 'ruled':
        return {
          backgroundImage: `
            repeating-linear-gradient(
              0deg, transparent, transparent ${lineSpacing - 1}px,
              ${lineColor} ${lineSpacing - 1}px, ${lineColor} ${lineSpacing}px
            )
          `,
          backgroundSize: `100% ${lineSpacing}px`,
        }
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(${lineColor} 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: `${lineSpacing}px ${lineSpacing}px`,
        }
      case 'dotted':
        return {
          backgroundImage: `radial-gradient(circle, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${lineSpacing}px ${lineSpacing}px`,
        }
      default:
        return {}
    }
  }

  return (
    <div style={{
      background: theme.background,
      minHeight: '100vh',
      position: 'relative',
      ...getPatternCSS(),
      ...style,
    }}>
      {/* Subtle paper texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E")`,
        opacity: 0.5,
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}