const translations = {
  ko: {
    title: '30일 챌린지',
    subtitle: '둘이서 함께하는 30일 도전!!',
    googleLogin: 'Google로 시작하기',
    orEmail: '또는 이메일로 로그인',
    loginPrompt: '바로 시작해봐!!',
    emailPlaceholder: '이메일 주소',
    sendLink: '로그인 링크 받기',
    sending: '보내는 중...',
    checkEmail: '메일함 확인해봐!!',
    sentTo: '로 링크 보냈어!',
    clickLink: '메일에서 링크 누르면 바로 시작이야!!',
    tryOther: '다른 이메일로 해볼래',
    noAccount: '가입 필요 없어~ 이메일만 있으면 돼!',
    invalidEmail: '이메일 다시 확인해봐!',
    loading: '잠깐만...',
    loadingChallenge: '챌린지 불러오는 중...',

    newChallenge: '새 챌린지 만들기',
    invitePartner: '같이 할 사람 데려와!!',
    me: '나',
    partner: '파트너',
    myName: '내 이름',
    partnerName: '파트너 이름',
    partnerEmail: '파트너 이메일',
    goalLater: '목표는 나중에 각자 정하면 돼~',
    startChallenge: '챌린지 시작!!',
    creating: '만드는 중...',

    challengeCreated: '챌린지 생성 완료!!',
    partnerInstructions: (email) => `${email}한테 이 링크 보내줘!`,
    partnerInstructionsDesc: '상대가 로그인하면 자동으로 연결돼!! 너무 간단하지 않아?',
    copyLink: '링크 복사',
    linkCopied: '복사됐어!',
    goToChallenge: '챌린지 가기',
    logout: '로그아웃',
    logoutConfirm: '진짜 나갈 거야?',
    newChallengBtn: '새로 시작하기',
    newChallengeConfirm: '지금 챌린지 끝내고 새로 할 거야?\n(기록 다 날아가는데 괜찮지?)',
    settings: '설정',

    meTag: '나',
    setGoal: '목표 적어봐!!',
    goalPlaceholder: '30일 동안 뭐 할 건데~',
    noGoalYet: '아직 목표 안 정했네',
    save: '저장',
    days: '일',
    complete: '완료!!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: '체크 해제할 거야?',
    partnerCheckedIn: (name) => `${name} 방금 체크인 했어!!`,
    today: '오늘',
    footerTip: '곰 눌러서 체크인 · 목표 누르면 수정 가능!',

    ahead: (name, gap) => `${name}이(가) ${gap}일 앞서고 있어 ㅋㅋ`,
    encouragements: {
      3: [
        '좀 밀렸는데 괜찮아 ㅋㅋ 오늘부터 다시 하자!!',
        '아직 따라잡을 수 있어!! 지금 시작해봐!',
        '천천히 해도 돼~ 포기만 하지 말자 ㅎㅎ',
      ],
      7: [
        '좀 많이 벌어졌다... 근데 지금이라도 해!!',
        '상대가 진심으로 하고 있어 ㅋㅋ 자극 좀 받아봐!',
        '7일 차이면 일주일이면 따라잡지~ 화이팅!!',
      ],
      12: [
        '많이 밀렸지만 포기 노노!! 지금이 제일 빠른 때야!',
        '상대도 너 응원하고 있을 거야!! 같이 가자!!',
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: '첫 발자국!', sub: '시작이 반이지!!' },
      3:  { icon: '🌿', text: '3일 달성!', sub: '오 좋은 출발인데?' },
      5:  { icon: '⭐', text: '5일 돌파!', sub: '슬슬 습관 되는 중 ㅎㅎ' },
      7:  { icon: '🌈', text: '일주일!!', sub: '벌써 일주일이라니!!' },
      10: { icon: '🔥', text: '10일 돌파!', sub: '3분의 1 왔어!!' },
      15: { icon: '🎪', text: '반이다!!', sub: '절반 달성 ㄹㅇ 대단해!!' },
      20: { icon: '🚀', text: '20일!!', sub: '이제 10일만 더!!' },
      25: { icon: '💎', text: '거의 다 왔어!', sub: '마지막 스퍼트!!' },
      28: { icon: '🏃', text: '2일만 더!!', sub: '코앞이야 진짜!!' },
      30: { icon: '🏆', text: '30일 완주!!', sub: 'ㄹㅇ 레전드!!' },
    },

    streakLabel: '연속',
    checkedIn: '체크인!',

    celebTitle: '미쳤어!!',
    celebCompleted: '30일 챌린지 완주!!',
    celebMsg: '매일매일 해낸 거 진짜 대박이야!!\n30일 동안 꾸준히 한 거 충분히 자랑스러워해도 돼!!\n이 습관 앞으로도 쭉 가자!!',
    celebClose: '계속 달려!!',
  },

  en: {
    title: '30-Day Challenge',
    subtitle: 'A 30-day challenge for twoo ro!',
    googleLogin: 'Continue with Google',
    orEmail: 'or login with email ro',
    loginPrompt: 'Get started ro!!',
    emailPlaceholder: 'Email address',
    sendLink: 'Get login link',
    sending: 'Sending ro...',
    checkEmail: 'Check your email ro!!',
    sentTo: ' — login link sent ro!',
    clickLink: 'Click the link in your inbox to start ro!!',
    tryOther: 'Try another email ro',
    noAccount: 'No sign-up needed ro, just your email!',
    invalidEmail: 'Check your email again ro!',
    loading: 'Hold on ro...',
    loadingChallenge: 'Loading challenge ro...',

    newChallenge: 'New Challenge ro!',
    invitePartner: 'Bring your partner ro!!',
    me: 'Me',
    partner: 'Partner',
    myName: 'My name',
    partnerName: "Partner's name",
    partnerEmail: "Partner's email",
    goalLater: 'Goals can be set later ro~',
    startChallenge: 'Start Challenge ro!!',
    creating: 'Creating ro...',

    challengeCreated: 'Challenge Created ro!!',
    partnerInstructions: (email) => `Send this link to ${email} ro!`,
    partnerInstructionsDesc: 'They just log in and boom, auto-connected rooo!!',
    copyLink: 'Copy Link',
    linkCopied: 'Copied ro!',
    goToChallenge: 'Go to Challenge',
    logout: 'Logout',
    logoutConfirm: 'Really leaving ro?',
    newChallengBtn: 'Start New',
    newChallengeConfirm: 'End this challenge and start fresh ro?\n(All progress goes poof!)',
    settings: 'Settings',

    meTag: 'me',
    setGoal: 'Set your goal ro!!',
    goalPlaceholder: 'What are you gonna do for 30 days ro~',
    noGoalYet: 'No goal set yet ro',
    save: 'Save',
    days: 'days',
    complete: 'Done ro!!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: 'Uncheck this ro?',
    partnerCheckedIn: (name) => `${name} just checked in rooo!!`,
    today: 'today',
    footerTip: 'Tap bears to check in ro · Click goal to edit!',

    ahead: (name, gap) => `${name} is ${gap} days ahead rooo!`,
    encouragements: {
      3: [
        "A little behind but that's okayyy ro! Start again today!!",
        'You can still catch up rooo! Keep going!!',
        "Going slow is fine ro, just don't give up!!",
      ],
      7: [
        "Falling behind ro... but it's not too late!!",
        'Your partner is working sooo hard ro! Get motivated!!',
        '7 days gap?! One week to catch up rooo!!',
      ],
      12: [
        "Don't give up rooo!! Now is the best time to start!!",
        "Your partner is rooting for youuu!! Let's gooo together ro!!",
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: 'First step ro!', sub: 'The journey begins!!' },
      3:  { icon: '🌿', text: '3 days done ro!', sub: 'Ooo great start!!' },
      5:  { icon: '⭐', text: '5 days ro!', sub: 'Building a habit rooo~' },
      7:  { icon: '🌈', text: 'One week ro!!', sub: 'A whoooole week!!' },
      10: { icon: '🔥', text: '10 days ro!!', sub: 'One-third done rooo!!' },
      15: { icon: '🎪', text: 'Halfway rooo!!', sub: '50% complete!! So proudo!!' },
      20: { icon: '🚀', text: '20 days ro!!', sub: 'Just 10 moooore!!' },
      25: { icon: '💎', text: 'Almost there ro!!', sub: 'Final stretch rooo!!' },
      28: { icon: '🏃', text: '2 more days ro!!', sub: 'Sooo close roooo!!' },
      30: { icon: '🏆', text: '30 days rooooo!!', sub: 'Absolutely legendary ro!!' },
    },

    streakLabel: 'streak',
    checkedIn: 'Checked in ro!',

    celebTitle: 'Amazinggg ro!!',
    celebCompleted: '30-Day Challenge Complete rooo!!',
    celebMsg: "You showed up every single day ro!! That's sooo incredible!!\nBe proudo of what 30 days of effort brought you!!\nWe hope this habit stays with you forever rooo!!",
    celebClose: 'Keep going ro!!',
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
