# 30일 챌린지 🐰🐻

둘이서 함께하는 30일 도전 앱. 크레용 스타일의 귀여운 체크인 UI.

## 기능

- 이메일 기반 매직링크 로그인 (가입 불필요)
- 둘이 한 세트로 묶여 서로의 진행 상황 확인
- 크레용 텍스처로 동그라미 색칠
- 목표 인라인 편집 (본인만 수정 가능)
- 카드 위아래 순서 변경
- 진행도 차이에 따른 격려 메시지
- 30일 완주 시 컨페티 + 축하 모달
- Supabase Realtime으로 실시간 동기화

## 배포 순서

### 1. Supabase 설정

1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. **SQL Editor** → `supabase-setup.sql` 내용 전체 복사 → 실행
3. **Authentication → Providers** → Email 활성화, "Enable Email OTP" 체크
4. **Authentication → URL Configuration** → Site URL에 Vercel 배포 URL 입력 (나중에 업데이트)
5. **Settings → API** → `Project URL`과 `anon public` 키 복사

### 2. 로컬 테스트

```bash
# .env 파일 생성
cp .env.example .env
# .env에 Supabase URL과 anon key 입력

npm install
npm run dev
```

### 3. Vercel 배포

**방법 A: Vercel CLI**

```bash
npm i -g vercel
vercel
# 프롬프트 따라 진행
```

**방법 B: GitHub 연동**

1. GitHub에 레포 생성 & 푸시
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/30day-challenge.git
git push -u origin main
```
2. [Vercel](https://vercel.com) → Import Project → GitHub 레포 선택
3. Framework Preset: **Vite**
4. Environment Variables 추가:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Deploy 클릭

### 4. 배포 후 Supabase 설정 마무리

1. Vercel에서 배포된 URL 복사 (예: `https://30day-challenge.vercel.app`)
2. Supabase Dashboard → **Authentication → URL Configuration**
   - Site URL: `https://30day-challenge.vercel.app`
   - Redirect URLs에 추가: `https://30day-challenge.vercel.app`

## 프로젝트 구조

```
30day-challenge/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BunnyFace.jsx      # 토끼 SVG
│   │   ├── CelebrationModal.jsx # 축하 + 컨페티
│   │   ├── ChallengeCard.jsx   # 메인 카드
│   │   ├── CrayonCircle.jsx    # 크레용 동그라미
│   │   ├── EditableGoal.jsx    # 목표 편집
│   │   └── EncouragementBanner.jsx # 격려 배너
│   ├── lib/
│   │   ├── constants.js        # 색상, 테마, 메시지
│   │   ├── hooks.js            # useAuth, useChallenge
│   │   └── supabase.js         # Supabase 클라이언트
│   ├── App.jsx                 # 메인 앱 (라우팅)
│   ├── index.css               # 글로벌 스타일
│   └── main.jsx                # 엔트리
├── .env.example
├── index.html
├── package.json
├── supabase-setup.sql
└── vite.config.js
```

## 사용 흐름

1. 접속 → 이메일 입력 → 매직링크로 로그인
2. 챌린지 없으면 → 파트너 이름/이메일 입력 → 생성
3. 챌린지 있으면 → 바로 메인 화면
4. 🎯 클릭 → 목표 설정/수정
5. 동그라미 클릭 → 크레용 색칠 체크인
6. 상대방이 체크인하면 실시간 반영
7. 3일 이상 차이나면 격려 배너 표시
8. 30일 완주 → 🎉 축하!
