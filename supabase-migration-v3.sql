-- =============================================
-- Couple Challenge — Migration v3
-- 스킨 해금을 유저 선택 방식으로 변경
-- supabase-migration-v2.sql 이후에 실행
-- =============================================

-- 유저별 해금된 스킨 목록 (JSON 배열)
-- 레벨업 시 유저가 직접 선택한 스킨이 추가됨
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS unlocked_skins_a JSONB DEFAULT '["stripe"]';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS unlocked_skins_b JSONB DEFAULT '["stripe"]';

-- =============================================
-- 완료! 이제 레벨업 시 유저가 원하는 스킨을 선택 가능
-- =============================================
