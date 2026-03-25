-- 30일 챌린지 Supabase 설정
-- Supabase SQL Editor에서 실행하세요

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  email_a TEXT NOT NULL,
  name_a TEXT NOT NULL,
  goal_a TEXT DEFAULT '',
  days_a BOOLEAN[] DEFAULT ARRAY[
    false,false,false,false,false,false,false,false,false,false,
    false,false,false,false,false,false,false,false,false,false,
    false,false,false,false,false,false,false,false,false,false
  ],
  
  email_b TEXT NOT NULL,
  name_b TEXT NOT NULL,
  goal_b TEXT DEFAULT '',
  days_b BOOLEAN[] DEFAULT ARRAY[
    false,false,false,false,false,false,false,false,false,false,
    false,false,false,false,false,false,false,false,false,false,
    false,false,false,false,false,false,false,false,false,false
  ],
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  completed_a_at TIMESTAMPTZ,
  completed_b_at TIMESTAMPTZ
);

-- 2. 인덱스
CREATE INDEX IF NOT EXISTS idx_challenges_email_a ON challenges (email_a);
CREATE INDEX IF NOT EXISTS idx_challenges_email_b ON challenges (email_b);

-- 3. RLS 활성화
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 4. 정책: 본인이 참가한 챌린지만 조회
CREATE POLICY "참가자만 조회" ON challenges
  FOR SELECT USING (
    auth.jwt()->>'email' = email_a OR 
    auth.jwt()->>'email' = email_b
  );

-- 5. 정책: A측 업데이트 (goal_a, days_a만)
CREATE POLICY "A측 업데이트" ON challenges
  FOR UPDATE USING (auth.jwt()->>'email' = email_a)
  WITH CHECK (auth.jwt()->>'email' = email_a);

-- 6. 정책: B측 업데이트 (goal_b, days_b만)
CREATE POLICY "B측 업데이트" ON challenges
  FOR UPDATE USING (auth.jwt()->>'email' = email_b)
  WITH CHECK (auth.jwt()->>'email' = email_b);

-- 7. 정책: 인증된 사용자만 생성
CREATE POLICY "챌린지 생성" ON challenges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 8. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE challenges;
