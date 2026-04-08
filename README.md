# 30-Day Couple Challenge

둘이서 함께하는 30일 도전 앱. 매일 체크인하면 곰돌이가 알록달록 색칠되는 귀여운 UI.

## Features

- Google / Magic Link 로그인
- 파트너와 실시간 진행 상황 공유 (Supabase Realtime)
- 30가지 크레용 색상의 곰돌이 체크인
- 연속 체크인 스트릭 & 마일스톤 토스트
- 목표 인라인 편집 (본인만 수정 가능)
- 진행도 차이에 따른 격려 메시지
- 30일 완주 시 축하 애니메이션
- 한국어 / English 지원

## Tech Stack

- **Frontend** — React 18 + Vite
- **Backend** — Supabase (Auth, PostgreSQL, Realtime)

## Getting Started

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 입력

# 개발 서버
npm run dev
```

## Supabase Setup

1. [Supabase Dashboard](https://supabase.com/dashboard) 에서 프로젝트 생성
2. **SQL Editor** → `supabase-setup.sql` 실행
3. **Authentication > Providers** → Google 활성화 + Email OTP 활성화
4. **Authentication > URL Configuration** → Site URL에 배포 URL 입력

## Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가.

## Project Structure

```
src/
├── components/
│   ├── AchievementBadges.jsx   # 연속 체크인 뱃지
│   ├── BearCircle.jsx          # 곰돌이 체크인 아이콘
│   ├── BearPreview.jsx         # 곰돌이 미리보기
│   ├── Celebration.jsx         # 완주 축하 모달 + 컨페티
│   ├── ChallengeCard.jsx       # 메인 챌린지 카드
│   ├── EditableGoal.jsx        # 목표 편집
│   ├── EncouragementBanner.jsx # 격려 배너
│   ├── MilestoneToast.jsx      # 마일스톤 알림
│   └── ProgressBar.jsx         # 진행 바
├── lib/
│   ├── constants.js            # 크레용 색상 팔레트
│   ├── hooks.js                # useAuth, useChallenge
│   ├── i18n.js                 # 다국어 번역
│   └── supabase.js             # Supabase 클라이언트
├── App.jsx                     # 메인 앱
└── index.css                   # 글로벌 스타일
```
