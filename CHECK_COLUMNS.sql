-- Run this in Supabase SQL Editor to see actual column names

SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('shops', 'bills', 'payments')
ORDER BY table_name, ordinal_position;
