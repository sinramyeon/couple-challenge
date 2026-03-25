export const PASTEL_FILLS = [
  "#E8D5F5","#D5E8F5","#F5E0D5","#D5F5E0","#F5F0D5",
  "#F5D5E8","#D5F5F0","#F0D5F5","#E0F5D5","#F5D5D5",
  "#D5E0F5","#E8F5D5","#F5D5F0","#D5F5E8","#F0F5D5",
  "#F5E8D5","#D5F0F5","#E0D5F5","#F5D5E0","#D5F5D5",
  "#E8D5F5","#D5E8F5","#F5E0D5","#D5F5E0","#F5F0D5",
  "#F5D5E8","#D5F5F0","#F0D5F5","#E0F5D5","#F5D5D5",
]

export const CRAYON_COLORS = [
  "#C4A0E0","#87BEE0","#E0A087","#87E0A0","#E0D587",
  "#E087BE","#87E0D5","#D587E0","#A0E087","#E08787",
  "#87A0E0","#BEE087","#E087D5","#87E0BE","#D5E087",
  "#E0BE87","#87D5E0","#A087E0","#E087A0","#87E087",
  "#C4A0E0","#87BEE0","#E0A087","#87E0A0","#E0D587",
  "#E087BE","#87E0D5","#D587E0","#A0E087","#E08787",
]

export const THEMES = {
  a: { color: "#C4A0E0", light: "#f0e8f8", dark: "#8B6AAE", border: "#e8ddf0" },
  b: { color: "#87BEE0", light: "#e0f0f8", dark: "#5A8AAE", border: "#d5e0f0" },
}

export const EMOJIS = { a: "🐰", b: "🐻" }

const ENCOURAGEMENTS = [
  { gap: 3, msgs: [
    "조금 뒤처졌지만 괜찮아! 오늘부터 다시 🔥",
    "아직 충분히 따라잡을 수 있어! 힘내 💪",
    "천천히 가도 괜찮아, 포기만 하지 말자 🌿",
  ]},
  { gap: 7, msgs: [
    "많이 벌어졌네... 하지만 지금 시작하면 돼! 🏃",
    "상대가 열심히 하고 있어! 자극 받아볼까? ⚡",
    "7일 차이는 일주일이면 따라잡아! 화이팅 🎯",
  ]},
  { gap: 12, msgs: [
    "많이 밀렸지만, 포기하지 마! 지금이 가장 빠른 때야 🌅",
    "상대방도 너를 응원하고 있을 거야! 같이 가자 🤝",
  ]},
]

export function getEncouragement(myCount, theirCount) {
  const gap = theirCount - myCount
  if (gap < 3) return null
  for (let i = ENCOURAGEMENTS.length - 1; i >= 0; i--) {
    if (gap >= ENCOURAGEMENTS[i].gap) {
      const msgs = ENCOURAGEMENTS[i].msgs
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
  return null
}
