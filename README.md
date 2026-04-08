# 30-Day Couple Challenge

둘이서 함께하는 30일 도전 앱. 매일 체크인하면 담곰이 색연필로 색칠되는 귀여운 UI.

## Features

- Google / Magic Link 로그인
- 파트너와 실시간 진행 상황 공유 (Supabase Realtime)
- 60가지 색연필 색상의 담곰 체크인 (클릭 시 1초 색칠 애니메이션)
- 4종 스킨: 담곰, 울보 담곰, 부들 담곰, 치이카와
- 커플 레벨 시스템 (XP 기반, 레벨업 시 새 스킨 선택 가능)
- 30일 완주 후 새 목표로 다시 시작 (레벨 유지) 또는 새 파트너와 시작 (레벨 초기화)
- 연속 체크인 스트릭 & 마일스톤 토스트
- 찔러보기 (Nudge) — 상대방에게 체크인 알림 (DB 저장, 오프라인도 수신 가능)
- 목표 인라인 편집 (본인만 수정 가능)
- 진행도 차이에 따른 격려 메시지
- 30일 완주 시 컨페티 + 축하 모달 + "완료!!" 버튼 wiggle 애니메이션
- 한국어 / English 지원 (귀여운 말투 — 영어는 ro~ 스타일)
- 제주 서체 (JejuGothic) 폰트
- 흰/검 모노톤 UI 디자인

## Level System

XP 획득 방법:
- 체크인: +10 XP
- 3일 연속: +5 XP
- 7일 연속: +15 XP
- 10일 연속: +30 XP
- 둘 다 같은 날 체크인: +10 XP
- 마일스톤 (10,15,20,25,30일): +20 XP

레벨 & 스킨:
| Level | XP | 새 스킨 | 예상 시점 |
|---|---|---|---|
| Lv.1 | 0 | 담곰 (기본) | 시작 |
| Lv.2 | 700 | 울보 담곰 | ~1달 완주 |
| Lv.3 | 1500 | 부들 담곰 | ~2달 |
| Lv.4 | 3000 | 치이카와 | ~3-4달 |

- 레벨업 시 스킨 선택 팝업이 자동으로 열려서 새로 해금된 스킨을 고를 수 있음
- 선택한 스킨은 DB에 저장되어 기기 간 동기화

- 1달 최대 커플 XP: ~1200 (30일 완벽 + 동시 체크인)
- XP는 챌린지 재시작 시 `banked_xp`에 누적 보존

## Challenge Restart

설정 메뉴에서 두 가지 옵션:
- **새 목표로 다시 시작** — days 리셋, 레벨/XP 유지 (같은 파트너)
- **새 파트너와 시작** — 챌린지 삭제, 레벨/XP 초기화

둘 다 30일 완주 시:
- 축하 모달에 "새로운 목표로 다시 시작!" 버튼
- 카드 하단 "완료!!" 버튼 클릭으로도 재시작 가능

## Tech Stack

- **Frontend** — React 18 + Vite
- **Backend** — Supabase (Auth, PostgreSQL, Realtime)
- **Font** — JejuGothic + Pretendard

## Getting Started

```bash
npm install

cp .env.example .env
# .env에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 입력

npm run dev
```

### Dev Mode (로컬 테스트)

```
http://localhost:5173/?dev=true
```

Supabase 없이 모든 기능 테스트 가능:
- A/B 사이드 전환
- 체크인 빠르게 채우기 (Fill 5~30)
- 모든 스킨 레벨별 선택 테스트
- Nudge 알림 테스트
- XP/레벨 실시간 확인
- 마일스톤/축하 애니메이션
- 30일 완주 → "완료!!" 클릭으로 재시작 테스트

## Supabase Setup

### 1. 초기 설정

1. [Supabase Dashboard](https://supabase.com/dashboard) 에서 프로젝트 생성
2. **SQL Editor** → `supabase-setup.sql` 실행
3. **Authentication > Providers** → Google 활성화 + Email OTP 활성화
4. **Authentication > URL Configuration** → Site URL에 배포 URL 입력

### 2. Migration (v2)

`supbase-migration-v2.sql`을 SQL Editor에서 실행. 포함 내용:
- `skin_a`/`skin_b` — 스킨 선택 저장
- `last_nudge_a`/`last_nudge_b` — 찔러보기 DB 저장 (오프라인 수신)
- `note_a`/`note_b`, `mood_a`/`mood_b` — 일일 노트/무드
- `banked_xp` — 챌린지 재시작 시 누적 XP 보존
- 이메일 소문자 정규화
- RLS 정책 업데이트 (대소문자 무시 + 챌린지 리셋 허용)
- 인덱스 추가

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
│   ├── BearSVG.jsx             # 담곰 체크인 (PNG + canvas 색칠 애니메이션)
│   ├── ChallengeCard.jsx       # 메인 챌린지 카드 (완료 시 재시작)
│   ├── Celebration.jsx         # 완주 축하 + 컨페티 + 재시작 버튼
│   ├── CoupleInteractions.jsx  # Nudge 버튼
│   ├── EditableGoal.jsx        # 목표 편집
│   ├── EncouragementBanner.jsx # 격려 배너
│   ├── LevelSystem.jsx         # 커플 레벨 + XP + 다음 스킨 표시
│   ├── MilestoneToast.jsx      # 마일스톤 알림
│   ├── PaperBackground.jsx     # 배경 텍스쳐
│   ├── ProgressBar.jsx         # 진행 바
│   ├── SkinPicker.jsx          # 스킨 선택 (레벨별 해금)
│   └── WashiTape.jsx           # 장식 테이프
├── lib/
│   ├── hooks.js                # useAuth, useChallenge, nudge DB 저장/수신
│   ├── i18n.js                 # 다국어 (ko/en 귀여운 말투)
│   ├── skins.js                # 60색 팔레트, 스킨 목록 + 해금 레벨
│   └── supabase.js             # Supabase 클라이언트
├── App.jsx                     # 메인 앱
├── DevApp.jsx                  # Dev 테스트 모드 (전체 기능)
└── index.css                   # 글로벌 스타일 + 애니메이션
```

## Skins

| ID | 이미지 | 이름 | 해금 |
|---|---|---|---|
| stripe | damgom.png | 담곰 | Lv.1 |
| simple | damgom_cry.png | 울보 담곰 | Lv.2 |
| shiver | damgom_cry_shiver.png | 부들 담곰 | Lv.3 |
| chiikawa | chiikawa.png | 치이카와 | Lv.4 |

- 레벨업 시 스킨 선택 팝업이 자동으로 열림
- 선택 결과는 DB (`skin_a`/`skin_b`)에 저장 → 기기 간 동기화
