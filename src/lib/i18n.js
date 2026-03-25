const translations = {
  ko: {
    title: '30일 챌린지',
    subtitle: '둘이서 함께하는 30일 도전',
    googleLogin: 'Google로 시작하기',
    orEmail: '또는 이메일로 로그인',
    loginPrompt: '간편하게 시작하세요',
    emailPlaceholder: '이메일 주소',
    sendLink: '로그인 링크 받기',
    sending: '전송 중...',
    checkEmail: '메일을 확인해주세요!',
    sentTo: '로 로그인 링크를 보냈어요.',
    clickLink: '메일함에서 링크를 클릭하면 바로 시작!',
    tryOther: '다른 이메일로 시도',
    noAccount: '가입 없이 이메일만으로 로그인',
    invalidEmail: '올바른 이메일을 입력해주세요',
    loading: '로딩 중...',
    loadingChallenge: '챌린지 불러오는 중...',

    newChallenge: '새 챌린지 만들기',
    invitePartner: '함께할 파트너를 초대하세요',
    me: '나',
    partner: '파트너',
    myName: '내 이름',
    partnerName: '파트너 이름',
    partnerEmail: '파트너 이메일',
    goalLater: '목표는 각자 나중에 설정할 수 있어요',
    startChallenge: '챌린지 시작하기!',
    creating: '생성 중...',

    challengeCreated: '챌린지 생성 완료!',
    partnerInstructions: (email) => `${email}에게 이 링크를 공유하세요`,
    partnerInstructionsDesc: '파트너가 Google 또는 이메일로 로그인하면 자동으로 챌린지에 참여돼요!',
    copyLink: '링크 복사하기',
    linkCopied: '복사 완료!',
    goToChallenge: '챌린지로 가기',
    logout: '로그아웃',
    logoutConfirm: '정말 로그아웃 하시겠어요?',
    newChallengBtn: '새로 시작하기',
    newChallengeConfirm: '현재 챌린지를 종료하고 새로 시작할까요?\n(기존 기록은 삭제됩니다)',
    settings: '설정',

    meTag: '나',
    setGoal: '목표를 설정해주세요...',
    goalPlaceholder: '30일 목표를 적어보세요...',
    noGoalYet: '아직 목표를 설정하지 않았어요',
    save: '저장',
    days: '일',
    complete: '완료!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: '체크를 해제할까요?',
    partnerCheckedIn: (name) => `${name}님이 체크인했어요!`,
    today: '오늘',
    footerTip: '동그라미를 눌러 체크인 · 목표 클릭해서 수정',

    ahead: (name, gap) => `${name}이(가) ${gap}일 앞서고 있어요!`,
    encouragements: {
      3: [
        '조금 뒤쳐졌지만 괜찮아요! 오늘부터 다시 해봐요!',
        '아직 충분히 따라잡을 수 있어요! 화이팅!',
        '천천히 가도 괜찮으니까, 포기만 하지 말죠!',
      ],
      7: [
        '많이 벌어졌어요... 하지만 지금! 시작해요!',
        '상대가 열심히 하고 있어요! 자극 되지 않나요?',
        '7일 차이는 일주일이면 따라잡아요! 화이팅!',
      ],
      12: [
        '많이 밀렸지만, 포기하지 마요! 지금이 가장 빠른 때!',
        '상대방도 너를 응원하고 있어요! 같이 가요!',
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: '첫 발자국!', sub: '시작이 반입니다!' },
      3:  { icon: '🌿', text: '3일 달성!', sub: '좋은 출발이예요.' },
      5:  { icon: '⭐', text: '5일 돌파!', sub: '습관이 생기기 시작하고 있어요!' },
      7:  { icon: '🌈', text: '일주일 달성!', sub: '벌써 일주일이야!' },
      10: { icon: '🔥', text: '10일 돌파!', sub: '3분의 1 완료!' },
      15: { icon: '🎪', text: '반이나 왔어!', sub: '절반 달성! 대단해요!' },
      20: { icon: '🚀', text: '20일 돌파!', sub: '이제 10일만 더!' },
      25: { icon: '💎', text: '거의 다 왔어!', sub: '마지막 스퍼트!' },
      28: { icon: '🏃', text: '2일만 더!', sub: '코앞이예요!!' },
      30: { icon: '🏆', text: '30일 완주!!', sub: '정말 대단해!!' },
    },

    streakLabel: '연속',
    checkedIn: '체크인!',

    celebTitle: '대단해요!!',
    celebCompleted: '30일 챌린지 완주!',
    celebMsg: '매일매일 꾸준히 해낸 당신, 정말 대단해요!!\n30일의 노력이 만든 이 결과 충분히 자랑스러워해도 돼요.\n이 습관이 앞으로도 쭉 이어지길 응원할게요!',
    celebClose: '계속 응원하기',
  },

  en: {
    title: '30-Day Challenge',
    subtitle: 'A 30-day challenge for two',
    googleLogin: 'Continue with Google',
    orEmail: 'or login with email',
    loginPrompt: 'Get started easily',
    emailPlaceholder: 'Email address',
    sendLink: 'Get login link',
    sending: 'Sending...',
    checkEmail: 'Check your email!',
    sentTo: ' — login link sent.',
    clickLink: 'Click the link in your inbox to get started!',
    tryOther: 'Try another email',
    noAccount: 'No sign-up needed, just your email',
    invalidEmail: 'Please enter a valid email',
    loading: 'Loading...',
    loadingChallenge: 'Loading challenge...',

    newChallenge: 'Create New Challenge',
    invitePartner: 'Invite your partner',
    me: 'Me',
    partner: 'Partner',
    myName: 'My name',
    partnerName: "Partner's name",
    partnerEmail: "Partner's email",
    goalLater: 'Goals can be set individually later',
    startChallenge: 'Start Challenge!',
    creating: 'Creating...',

    challengeCreated: 'Challenge Created!',
    partnerInstructions: (email) => `Share this link with ${email}`,
    partnerInstructionsDesc: 'Your partner just needs to log in with Google or email to join automatically!',
    copyLink: 'Copy Link',
    linkCopied: 'Copied!',
    goToChallenge: 'Go to Challenge',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    newChallengBtn: 'Start New',
    newChallengeConfirm: 'End current challenge and start fresh?\n(All progress will be deleted)',
    settings: 'Settings',

    meTag: 'me',
    setGoal: 'Set your goal...',
    goalPlaceholder: 'Write your 30-day goal...',
    noGoalYet: 'No goal set yet',
    save: 'Save',
    days: 'days',
    complete: 'Done!',

    daysRemaining: (n) => `D-${n}`,
    uncheckConfirm: 'Uncheck this day?',
    partnerCheckedIn: (name) => `${name} just checked in!`,
    today: 'today',
    footerTip: 'Tap circles to check in · Click goal to edit',

    ahead: (name, gap) => `${name} is ${gap} days ahead!`,
    encouragements: {
      3: [
        "A little behind, but that's okay! Start again today ro!",
        'You can still catch up! Keep going ro!',
        "It's fine to go slowo, just don't give up ro!",
      ],
      7: [
        "Falling behindro... but it's not too late!",
        'Your partner is working hard ro! Get motivated!',
        '7 days gap?! — one week to catch up ro!',
      ],
      12: [
        "Don't give up rooo! Now is the best time to start hehe",
        "Your partner is rooting for you!! Let's go togetherooo",
      ],
    },

    milestones: {
      1:  { icon: '🌱', text: 'First step!', sub: 'The journey begins ro!' },
      3:  { icon: '🌿', text: '3 days done!', sub: 'Great start ro!' },
      5:  { icon: '⭐', text: '5 days!', sub: 'Building a habit ro' },
      7:  { icon: '🌈', text: 'One week!', sub: 'A whole week rooo!' },
      10: { icon: '🔥', text: '10 days!', sub: 'One-third done hehe!' },
      15: { icon: '🎪', text: 'Halfway!', sub: '50% complete roooo so proudooo!' },
      20: { icon: '🚀', text: '20 days!', sub: 'Just 10 more ro!' },
      25: { icon: '💎', text: 'Almost there!', sub: 'Final stretch ro!' },
      28: { icon: '🏃', text: '2 more days!', sub: 'So close roooo!!' },
      30: { icon: '🏆', text: '30 days!!', sub: 'Incredible rooooooo!!' },
    },

    streakLabel: 'streak',
    checkedIn: 'Checked in!',

    celebTitle: 'Amazing!!',
    celebCompleted: '30-Day Challenge Complete!',
    celebMsg: "You showed up every single day ro!!! that's incredible!\nBe proudo of what 30 days of effort brought you.\nWe hope this habit stays with you forever rooo!!!",
    celebClose: 'Keep going',
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
