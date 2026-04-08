/*
  Bear skin system — 3 skins inspired by the PDF challenge sheets.
  Each skin defines an SVG path for the bear shape, plus metadata.
  The bear is drawn in a 52×52 viewBox by default.
*/

// ─── Skin definitions ───

export const SKINS = {
  stripe: {
    id: 'stripe',
    nameKo: '줄무늬 배 곰',
    nameEn: 'Stripy belly bear',
    emoji: '🧸',
    // Sitting bear with striped belly (PDF 1)
    // viewBox: 0 0 100 100
    body: `
      M50 8 C35 8 22 18 20 32 C18 38 19 44 22 48
      L22 50 C20 52 18 56 18 62 C18 68 22 72 28 72
      L30 72 C32 76 36 78 42 78 L58 78 C64 78 68 76 70 72
      L72 72 C78 72 82 68 82 62 C82 56 80 52 78 50
      L78 48 C81 44 82 38 80 32 C78 18 65 8 50 8 Z
    `,
    // Small round ears
    earLeft: 'M28 18 C24 10 16 10 14 16 C12 22 18 26 24 24 Z',
    earRight: 'M72 18 C76 10 84 10 86 16 C88 22 82 26 76 24 Z',
    // Belly stripes (3 horizontal lines)
    stripes: [
      { y: 52, x1: 36, x2: 64 },
      { y: 58, x1: 38, x2: 62 },
      { y: 64, x1: 40, x2: 60 },
    ],
    // Face features positions
    face: {
      eyeLeftX: 40, eyeLeftY: 34,
      eyeRightX: 60, eyeRightY: 34,
      eyeSize: 2.5,
      noseX: 50, noseY: 40,
      noseW: 4, noseH: 3,
      mouthPath: 'M46 43 Q50 47 54 43',
      blushLeftX: 33, blushRightX: 67, blushY: 40, blushSize: 4,
    },
    // Clip area for crayon fill (oval around body)
    clipCx: 50, clipCy: 46, clipRx: 32, clipRy: 36,
  },

  simple: {
    id: 'simple',
    nameKo: '심플 곰',
    nameEn: 'Simple bear',
    emoji: '🐻',
    // Standing bear with clean lines (PDF 2)
    body: `
      M50 10 C36 10 24 20 22 34 C20 40 21 46 24 50
      L24 52 C22 54 22 58 22 62 L22 78 C22 82 26 84 30 84
      L36 84 C38 82 38 78 38 74 L62 74 C62 78 62 82 64 84
      L70 84 C74 84 78 82 78 78 L78 62 C78 58 78 54 76 52
      L76 50 C79 46 80 40 78 34 C76 20 64 10 50 10 Z
    `,
    earLeft: 'M30 20 C26 12 18 12 16 18 C14 24 20 28 26 26 Z',
    earRight: 'M70 20 C74 12 82 12 84 18 C86 24 80 28 74 26 Z',
    stripes: [],
    face: {
      eyeLeftX: 40, eyeLeftY: 34,
      eyeRightX: 60, eyeRightY: 34,
      eyeSize: 2.5,
      noseX: 50, noseY: 40,
      noseW: 4, noseH: 3,
      mouthPath: 'M46 43 Q50 47 54 43',
      blushLeftX: 33, blushRightX: 67, blushY: 40, blushSize: 4,
    },
    // Legs for standing pose
    legs: [
      { x: 28, y: 68, w: 12, h: 16, rx: 5 },
      { x: 60, y: 68, w: 12, h: 16, rx: 5 },
    ],
    clipCx: 50, clipCy: 48, clipRx: 30, clipRy: 38,
  },

  heart: {
    id: 'heart',
    nameKo: '하트 곰',
    nameEn: 'Heart bear',
    emoji: '💕',
    // Bear holding a heart (PDF 3)
    body: `
      M50 10 C36 10 24 20 22 34 C20 40 21 46 24 50
      L20 54 C18 58 18 64 20 68 C22 72 26 76 32 78
      L42 78 C46 78 48 76 50 74 C52 76 54 78 58 78
      L68 78 C74 76 78 72 80 68 C82 64 82 58 80 54
      L76 50 C79 46 80 40 78 34 C76 20 64 10 50 10 Z
    `,
    earLeft: 'M28 18 C24 10 16 10 14 16 C12 22 18 26 24 24 Z',
    earRight: 'M72 18 C76 10 84 10 86 16 C88 22 82 26 76 24 Z',
    stripes: [],
    // Heart shape held by the bear
    heart: `
      M50 52 C50 48 44 42 38 42 C32 42 28 46 28 52
      C28 60 38 68 50 74 C62 68 72 60 72 52
      C72 46 68 42 62 42 C56 42 50 48 50 52 Z
    `,
    face: {
      eyeLeftX: 40, eyeLeftY: 32,
      eyeRightX: 60, eyeRightY: 32,
      eyeSize: 2.5,
      noseX: 50, noseY: 38,
      noseW: 4, noseH: 3,
      mouthPath: 'M46 41 Q50 45 54 41',
      blushLeftX: 33, blushRightX: 67, blushY: 38, blushSize: 4,
    },
    clipCx: 50, clipCy: 48, clipRx: 32, clipRy: 36,
  },
}

export const SKIN_LIST = Object.values(SKINS)
export const DEFAULT_SKIN = 'stripe'

// ─── Crayon palette (same 30 colors, now exported from here too) ───
export const CRAYON_COLORS = [
  "#FF6B6B", "#45B7D1", "#FFD93D", "#6BCB77", "#C882E8",
  "#FF8C42", "#4DD0E1", "#FF5E97", "#A0E548", "#7C83FF",
  "#FFB347", "#26C6DA", "#FF4F6F", "#66DE93", "#B56CFF",
  "#FF7043", "#40C9C9", "#FFCF48", "#E85D9A", "#5CC2A0",
  "#F0635A", "#5DA4E8", "#FFE156", "#82D965", "#D47CDB",
  "#FF9654", "#3DC1C1", "#FF72A0", "#8BE870", "#8F7CFF",
]

// ─── Paper/Background themes ───
export const THEMES = {
  notebook: {
    id: 'notebook',
    nameKo: '노트북',
    nameEn: 'Notebook',
    background: '#FFFEF7',
    lineColor: 'rgba(180, 210, 240, 0.3)',
    lineSpacing: 24,
    type: 'ruled',
  },
  grid: {
    id: 'grid',
    nameKo: '모눈종이',
    nameEn: 'Grid paper',
    background: '#FFFEF9',
    lineColor: 'rgba(160, 200, 160, 0.25)',
    lineSpacing: 20,
    type: 'grid',
  },
  dotted: {
    id: 'dotted',
    nameKo: '점선 노트',
    nameEn: 'Dotted',
    background: '#FFF9F5',
    lineColor: 'rgba(200, 180, 160, 0.35)',
    lineSpacing: 18,
    type: 'dotted',
  },
  plain: {
    id: 'plain',
    nameKo: '깔끔',
    nameEn: 'Plain',
    background: '#FFFFFF',
    lineColor: 'transparent',
    lineSpacing: 0,
    type: 'none',
  },
}

// ─── Washi tape colors (for decorative elements) ───
export const WASHI_TAPES = [
  { color: '#FFD4D4', pattern: 'dots' },
  { color: '#D4F0FF', pattern: 'stripes' },
  { color: '#FFF3D4', pattern: 'zigzag' },
  { color: '#E8D4FF', pattern: 'hearts' },
  { color: '#D4FFE8', pattern: 'stars' },
]

// ─── Sticker emojis for milestone decorations ───
export const STICKERS = {
  streak3: '⭐',
  streak5: '🌟',
  streak7: '🔥',
  streak10: '🏆',
  streak15: '💎',
  streak20: '👑',
  streak25: '🎪',
  streak30: '🎊',
  couple: '💑',
  heart: '💗',
  cheer: '📣',
}