/*
  Skins, colors, stickers, and themes for the 30-day challenge app.
  Central config file for all visual customization.
*/

// ─── 60 unique crayon colors — 30 soft + 30 vivid, never repeats ───
export const CRAYON_COLORS = [
  // 1-30: soft pastels
  "#F8A0A0", // 1 — soft coral
  "#78D0D8", // 2 — teal
  "#F8D060", // 3 — golden yellow
  "#A0D8A0", // 4 — sage green
  "#D0A0E8", // 5 — lavender
  "#F8B878", // 6 — peach orange
  "#80C8F0", // 7 — sky blue
  "#F090A8", // 8 — rose pink
  "#B8E078", // 9 — lime green
  "#F0C8E0", // 10 — baby pink
  "#60D0C0", // 11 — mint
  "#F8E888", // 12 — lemon
  "#A8B8F0", // 13 — periwinkle
  "#F0A080", // 14 — salmon
  "#88D8A0", // 15 — fresh green
  "#F8C8A0", // 16 — warm peach
  "#90C0E8", // 17 — cornflower
  "#F08888", // 18 — watermelon
  "#C8E8A0", // 19 — spring green
  "#E8A8C8", // 20 — orchid pink
  "#68D8D0", // 21 — aqua
  "#F8D8A0", // 22 — butter
  "#B0A8E0", // 23 — soft purple
  "#F0B898", // 24 — apricot
  "#78C8B8", // 25 — seafoam
  "#F8E0B0", // 26 — cream gold
  "#98B8E8", // 27 — steel blue
  "#F098B8", // 28 — candy pink
  "#A0D870", // 29 — chartreuse
  "#E8B8D0", // 30 — mauve
  // 31-60: vivid & fresh
  "#FF6B6B", // 31 — vivid red
  "#40C8E0", // 32 — bright cyan
  "#FFB830", // 33 — tangerine
  "#50D068", // 34 — emerald
  "#B868E8", // 35 — violet
  "#FF8848", // 36 — bright orange
  "#4898F0", // 37 — electric blue
  "#FF5088", // 38 — hot pink
  "#88D840", // 39 — neon lime
  "#F060A0", // 40 — fuchsia
  "#30D8B0", // 41 — jade
  "#F0D030", // 42 — sunflower
  "#6878F0", // 43 — indigo
  "#FF7060", // 44 — tomato
  "#48E088", // 45 — spring mint
  "#F8A050", // 46 — mango
  "#58A8F0", // 47 — ocean
  "#E85070", // 48 — raspberry
  "#98E048", // 49 — apple green
  "#D868B8", // 50 — magenta
  "#38E0C0", // 51 — turquoise
  "#F0C838", // 52 — gold
  "#8870E8", // 53 — grape
  "#F09068", // 54 — peach punch
  "#48C898", // 55 — shamrock
  "#FFD050", // 56 — banana
  "#7090F0", // 57 — sapphire
  "#E87898", // 58 — rose
  "#70D058", // 59 — grass
  "#C888E0", // 60 — wisteria
]

// ─── Skin list ───
export const SKIN_LIST = [
  { id: 'stripe',   img: '/damgom.png',            nameKo: '담곰',       nameEn: 'Damgom' },
  { id: 'simple',   img: '/damgom_cry.png',        nameKo: '울보 담곰',  nameEn: 'Cry Damgom ro' },
  { id: 'shiver',   img: '/damgom_cry_shiver.png', nameKo: '부들 담곰',  nameEn: 'Shiver Damgom' },
  { id: 'chiikawa', img: '/chiikawa.png',          nameKo: '치이카와',   nameEn: 'Chiikawa ro' },
]

export const DEFAULT_SKIN = 'stripe'

// ─── Streak stickers ───
export const STICKERS = {
  streak3:  '🌱',
  streak5:  '🌿',
  streak7:  '⭐',
  streak10: '🔥',
  streak15: '💎',
  streak20: '🏅',
  streak25: '👑',
}

// ─── Paper background themes ───
export const THEMES = {
  notebook: {
    type: 'ruled',
    background: '#FFFFFF',
    lineColor: 'rgba(180,210,240,0.25)',
    lineSpacing: 28,
  },
  grid: {
    type: 'grid',
    background: '#FFFFFF',
    lineColor: 'rgba(180,200,220,0.2)',
    lineSpacing: 24,
  },
  dotted: {
    type: 'dotted',
    background: '#FFFFFF',
    lineColor: 'rgba(160,160,180,0.25)',
    lineSpacing: 20,
  },
}
