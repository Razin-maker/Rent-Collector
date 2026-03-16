# Database Update Required

## Problem
Bills edit করার সময় previous unit এবং current unit show করছিল না কারণ database-এ এই columns ছিল না।

## Solution
Database-এ `prevunit` এবং `currunit` columns add করতে হবে।

## Steps:

1. **Supabase Dashboard-এ যান**
   - Visit: https://sjkkfciemgybjhwabepd.supabase.co
   - Login করুন

2. **SQL Editor খুলুন**
   - Left sidebar থেকে "SQL Editor" click করুন
   - "New Query" click করুন

3. **SQL Script Run করুন**
   - `server/add-unit-columns.sql` file-এর content copy করুন
   - SQL Editor-এ paste করুন
   - "Run" button click করুন অথবা Ctrl+Enter press করুন

4. **Application Restart করুন**
   - Server এবং client restart করুন
   - এখন bills edit করলে previous unit এবং current unit show করবে

## What Changed:

### Backend:
- `billRoutes.js` - prevUnit এবং currUnit save করার জন্য updated

### Frontend:
- `Bills.jsx` - Edit mode-এ prevUnit এবং currUnit show করার জন্য updated

### Database:
- `bills` table-এ `prevunit` এবং `currunit` columns added

## Note:
পুরানো bills-এ prevunit এবং currunit NULL থাকবে কারণ সেগুলো আগে save হয়নি। নতুন bills থেকে এই values save হবে।
