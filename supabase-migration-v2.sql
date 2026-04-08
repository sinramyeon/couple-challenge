-- =============================================
-- Couple Challenge — Full Migration
-- Supabase SQL Editor에서 실행하세요
-- 기존 supabase-setup.sql 이후에 실행
-- =============================================

-- ─── 1. 새 컬럼 추가 (Phase 1: Skins + Phase 2: Interaction) ───

ALTER TABLE challenges ADD COLUMN IF NOT EXISTS skin_a TEXT DEFAULT 'stripe';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS skin_b TEXT DEFAULT 'stripe';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS note_a TEXT DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS note_b TEXT DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS mood_a TEXT DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS mood_b TEXT DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS last_nudge_a TIMESTAMPTZ;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS last_nudge_b TIMESTAMPTZ;

-- 누적 XP (챌린지 재시작 시 이전 XP 보존)
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS banked_xp INTEGER DEFAULT 0;

-- ─── 2. 이메일 소문자 정규화 (대소문자 불일치 버그 방지) ───

UPDATE challenges SET email_a = lower(email_a), email_b = lower(email_b);

-- ─── 3. RLS 정책 업데이트 (대소문자 무시) ───

DROP POLICY IF EXISTS "참가자만 조회" ON challenges;
DROP POLICY IF EXISTS "A측 업데이트" ON challenges;
DROP POLICY IF EXISTS "B측 업데이트" ON challenges;

CREATE POLICY "참가자만 조회" ON challenges
  FOR SELECT USING (
    lower(auth.jwt()->>'email') = lower(email_a) OR
    lower(auth.jwt()->>'email') = lower(email_b)
  );

CREATE POLICY "A측 업데이트" ON challenges
  FOR UPDATE USING (lower(auth.jwt()->>'email') = lower(email_a))
  WITH CHECK (lower(auth.jwt()->>'email') = lower(email_a));

CREATE POLICY "B측 업데이트" ON challenges
  FOR UPDATE USING (lower(auth.jwt()->>'email') = lower(email_b))
  WITH CHECK (lower(auth.jwt()->>'email') = lower(email_b));

-- 챌린지 리셋용 (참가자 누구든 전체 필드 업데이트 가능)
DROP POLICY IF EXISTS "챌린지 리셋" ON challenges;
CREATE POLICY "챌린지 리셋" ON challenges
  FOR UPDATE USING (
    lower(auth.jwt()->>'email') = lower(email_a) OR
    lower(auth.jwt()->>'email') = lower(email_b)
  )
  WITH CHECK (
    lower(auth.jwt()->>'email') = lower(email_a) OR
    lower(auth.jwt()->>'email') = lower(email_b)
  );

-- ─── 4. Realtime (이미 활성화되어 있으면 이 줄 건너뛰기) ───
-- ALTER PUBLICATION supabase_realtime ADD TABLE challenges;
-- ↑ 이미 활성화된 경우 에러나므로 주석 처리됨

-- ─── 5. 인덱스 (이미 있으면 무시) ───

CREATE INDEX IF NOT EXISTS idx_challenges_email_a ON challenges (email_a);
CREATE INDEX IF NOT EXISTS idx_challenges_email_b ON challenges (email_b);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges (status);

-- =============================================
-- 완료! 이제 앱에서 스킨, Nudge, 레벨 시스템 사용 가능
-- =============================================
