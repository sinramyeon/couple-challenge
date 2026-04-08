const translations = {
  ko: {
    title: '30일 챌린지',
    subtitle: '둘이서 함께하는 30일 도전!!',
    googleLogin: 'Google로 시작하기',
    orEmail: '또는 이메일로 로그인',
    loginPrompt: '바로 시작해보세요!',
    emailPlaceholder: '이메일 주소',
    sendLink: '로그인 링크 받기',
    sending: '보내는 중...',
    checkEmail: '메일함을 확인해보세요!',
    sentTo: '로 링크 보냈어요!',
    clickLink: '메일에서 링크 누르면 바로 시작이예요!',
    tryOther: '다른 이메일로 해볼까요?',
    noAccount: '가입 없이 이메일만 있으면 돼요!',
    invalidEmail: '이메일 다시 확인해봐요!',
    loading: '잠시만요...',
    loadingChallenge: '챌린지 불러오는 중...',

    newChallenge: '새 챌린지 만들기',
    invitePartner: '같이 할 사람?',
    me: '나',
    partner: '파트너',
    myName: '내 이름',
    partnerName: '파트너 이름',
    partnerEmail: '파트너 이메일',
    goalLater: '목표는 나중에 각자 정하면 돼요!',
    startChallenge: '챌린지 시작!!',
    creating: '만드는 중...',

    challengeCreated: '챌린지 생성 완료!',
    partnerInstructions: (email) => `${email}한테 이 링크 보낼까요?`,
    partnerInstructionsDesc: '상대가 로그인하면 자동으로 연결돼!',
    copyLink: '링크 복사',
    linkCopied: '복사 완료!',
    goToChallenge: '챌린지 바로 시작하기',
    logout: '로그아웃',
    logoutConfirm: '로그아웃 할까요?',
    restartGoalBtn: '🔄 새 목표로 다시 시작',
    restartGoalConfirm: '새로운 목표로 다시 시작할까요?\n(레벨은 유지돼요!)',
    restartNewGoal: '새로운 목표로 다시 시작!',
    newPartnerBtn: '👋 새 파트너와 시작 (레벨 초기화)',
    newChallengBtn: '새로 시작하기',
    newChallengeConfirm: '새 파트너와 완전히 새로 시작할까요?\n(레벨, 기록 모두 초기화돼요!)',
    settings: '설정',

    meTag: '나',
    setGoal: '목표를 정해보세요!',
    goalPlaceholder: '30일 동안 무엇을 이뤄볼까요?',
    noGoalYet: '아직 목표가 없어요!',
    save: '저장',
    days: '일',
    complete: '완료!!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: '체크를 해제할까요?',
    partnerCheckedIn: (name) => `${name} 방금 체크인 했어요!!`,
    today: '오늘',
    footerTip: '아이콘을 클릭해서 체크인 · 목표 누르면 수정 가능!',

    ahead: (name, gap) => `${name}이(가) ${gap}일 앞서고 있어요!!`,
    encouragements: {
      3: [
        '좀 밀렸는데 오늘부터 두 번 해보는건 어때요?',
        '아직 따라잡을 수 있어요!! 지금 시작해요!',
        '천천히 해도 돼요. 포기만 하지 맙시다!!',
      ],
      7: [
        '좀 많이 벌어졌네요... 근데 지금이라도!!',
        '상대가 진심으로 하고 있다...자극 좀 받아볼까요?',
        '7일 차이면 일주일이면 따라잡죠! 화이팅!!',
      ],
      12: [
        '많이 밀렸지만 포기하지 마세요! 지금이 제일 빠른 때!',
        '제가 응원하고 있어요!! 같이 가요!!',
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: '첫 발자국!', sub: '시작이 반이예요!!' },
      3:  { icon: '🌿', text: '3일 달성!', sub: '벌써 3일 차?' },
      5:  { icon: '⭐', text: '5일 돌파!', sub: '작심 삼일을 벗어났어요!' },
      7:  { icon: '🌈', text: '일주일!!', sub: '벌써 일주일이라니!!' },
      10: { icon: '🔥', text: '10일 돌파!', sub: '3분의 1!!' },
      15: { icon: '🎪', text: '반이다!!', sub: '절반 달성!!' },
      20: { icon: '🚀', text: '20일!!', sub: '이제 10일만 더!!' },
      25: { icon: '💎', text: '거의 다 왔어!', sub: '마지막 스퍼트!!' },
      28: { icon: '🏃', text: '2일만 더!!', sub: '코 앞이예요!!' },
      30: { icon: '🏆', text: '30일 완주!!', sub: '목표를 이뤘어요!!' },
    },

    streakLabel: '연속',
    checkedIn: '체크인!',

    celebTitle: '미쳤어!!',
    celebCompleted: '30일 챌린지 완주!!',
    celebMsg: '매일매일 해낸 거 진짜 대단해요!!\n30일 동안 꾸준히 한 거 충분히 자랑스러워해도 돼요!!\n이 습관 앞으로도 쭉 가져요!!',
    celebClose: '계속 달려!!',

    skinPickerTitle: '챌린지 스킨 선택',
    skinAll: '레벨업할 때 원하는 스킨을 골라봐요!',
    changeSkin: '스킨 변경',

    sendNudge: '찔러보기',
    nudgeDesc: '상대방에게 체크인 알림 보내기',
    nudgeSent: '콕! 찔러봤어요!',
    nudgeReceived: (name) => `${name}이(가) 뭐하냐고 하네요! 빨리 체크인!!`,

    levelLabel: 'Lv.',
    xpLabel: 'XP',
    levelUp: '레벨업!!',
    levelUpMsg: (level) => `Lv.${level} 달성!! 대단해요!!`,
    xpGained: (xp) => `+${xp} XP`,
    coupleLevel: '커플 레벨',
    coupleLevelDesc: '체크인하면 XP가 올라가고, 둘 다 같은 날 체크인하면 보너스!',
  },

  en: {
    title: '30-Day Challenge',
    subtitle: 'a Challenge for two!',
    googleLogin: 'start with Googlro',
    orEmail: 'or login with emailo',
    loginPrompt: "let's gogogo!!",
    emailPlaceholder: 'email address',
    sendLink: 'get login link',
    sending: 'send send!!',
    checkEmail: 'check your email!!',
    sentTo: ' — link sent!',
    clickLink: 'click the link in your inbox to start!!',
    tryOther: 'try another email roo',
    noAccount: 'no signup ro~ just email!',
    invalidEmail: 'check emailo again ro!',
    loading: 'hold on ro...',
    loadingChallenge: 'loadingo loadingo...',

    newChallenge: 'New Challenge ro!',
    invitePartner: 'bring your partner ro!!',
    me: 'Me',
    partner: 'Partner',
    myName: 'my name',
    partnerName: "partno's name",
    partnerEmail: "partno's emaile",
    goalLater: 'goals latero, no worrio',
    startChallenge: 'Start Challenge!!',
    creating: 'making...',

    challengeCreated: 'Challenge created ro!!',
    partnerInstructions: (email) => `send this link to ${email} ro!`,
    partnerInstructionsDesc: 'they login and boom boom, auto-connected ro!!',
    copyLink: 'copy link',
    linkCopied: 'copied ro!',
    goToChallenge: 'go to Challenge',
    logout: 'logout',
    logoutConfirm: 'really leaving ro?',
    restartGoalBtn: '🔄 new goal, same team ro',
    restartGoalConfirm: 'start a new goal ro?\n(level stays!)',
    restartNewGoal: 'new goal, keep going ro!',
    newPartnerBtn: '👋 new partner (reset level)',
    newChallengBtn: 'start fresh',
    newChallengeConfirm: 'start fresh with new partner?\n(level & progress reset!)',
    settings: 'settings',

    meTag: 'me',
    setGoal: 'set your goalo ro!!',
    goalPlaceholder: 'what u gonna do for 30 days?',
    noGoalYet: 'no goal yet ro',
    save: 'savo',
    days: 'days',
    complete: 'done done!!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: 'uncheck thiso ro?',
    partnerCheckedIn: (name) => `${name} just checked in ro!!`,
    today: 'today',
    footerTip: 'tap tap to check in ro · click goal to edit!',

    ahead: (name, gap) => `${name} is ${gap} days ahead ro!`,
    encouragements: {
      3: [
        "a lil behind but okayrino! start today ro!!",
        'u can catch up ro! keep goin goin!!',
        "go slow is fine ro... just don't give up ro!!",
      ],
      7: [
        "fallin behind ro... but not too late!!",
        'your partno is workin so hardo! get motivation ro!!',
        '7 days gapo?! one week to catch up ro!!',
      ],
      12: [
        "don't give up ro!! now is the best timo!!",
        "partno is rootin for you ro!! let's gogogo!!",
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: 'first stepo!', sub: 'journey begins ro!!' },
      3:  { icon: '🌿', text: '3 days ro!', sub: 'great starto!!' },
      5:  { icon: '⭐', text: '5 dayso!', sub: 'buildin a habit!' },
      7:  { icon: '🌈', text: 'one weeko!!', sub: 'a whole week ro!!' },
      10: { icon: '🔥', text: '10 dayso!!', sub: 'one-third done sisisi!!' },
      15: { icon: '🎪', text: 'halfway ro!!', sub: '50% done!! so proudo!!' },
      20: { icon: '🚀', text: '20 days!!', sub: 'just 10 more ro!!' },
      25: { icon: '💎', text: 'almost there ro!!', sub: 'si final stretcho!!' },
      28: { icon: '🏃', text: '2 more days!!', sub: 'amaze amaze amaze!' },
      30: { icon: '🏆', text: '30 days!!', sub: 'absolut legeno!!' },
    },

    streakLabel: 'streak',
    checkedIn: 'checked in ro!',

    celebTitle: 'amaze amaze!!',
    celebCompleted: '30-day challe complete ro!!',
    celebMsg: "u showed up every single days!! incredible ro!!\nbe proudo of 30 days of efforto ro!!\nhope this habito stays with u forevero!!",
    celebClose: 'keep goin ro!!',

    skinPickerTitle: 'choose skins',
    skinAll: 'pick your fav skin when you level up ro!',
    changeSkin: 'change skino',

    sendNudge: 'nudge ro',
    nudgeDesc: 'send check-in remindo to partner',
    nudgeSent: 'nudged ro!',
    nudgeReceived: (name) => `${name} nudged you!! go check in!!`,

    levelLabel: 'Lv.',
    xpLabel: 'XP',
    levelUp: 'level up level up!!',
    levelUpMsg: (level) => `reached Lv.${level} ro!! amaze amaze amaze!!`,
    xpGained: (xp) => `+${xp} XP`,
    coupleLevel: 'couple levo',
    coupleLevelDesc: 'check in to earn XP ro. both check in same day for bonus bonus!',
  },
}

export function getTranslations(lang) {
  return translations[lang] || translations.ko
}

export function getEncouragement(myCount, theirCount, lang = 'ko') {
  const t = getTranslations(lang)
  const gap = theirCount - myCount
  if (gap < 3) return null
  const thresholds = [12, 7, 3]
  for (const threshold of thresholds) {
    if (gap >= threshold && t.encouragements[threshold]) {
      const msgs = t.encouragements[threshold]
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
  return null
}
