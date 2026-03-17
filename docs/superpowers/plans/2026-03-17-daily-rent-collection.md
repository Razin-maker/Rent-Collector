# Daily Rent Collection Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a "Checklist Style" daily rent collection feature for shops that operate on a daily rental basis.

**Architecture:** Add `rent_type` to shops to distinguish between monthly and daily billing. Create a new `daily_collections` table to track payments per date. Build a mobile-optimized UI component that allows ticking off several days at once for quick collection.

**Tech Stack:** React (Vite), Express.js, Supabase (PostgreSQL), Tailwind CSS (Neumorphism).

---

### Task 1: Database Migration
Update the database schema to support daily rentals and collection history.

**Files:**
- Create: `server/migrations/2026-03-17-add-daily-rent.sql`

- [ ] **Step 1: Write SQL migration**
```sql
ALTER TABLE shops ADD COLUMN IF NOT EXISTS rent_type TEXT DEFAULT 'monthly' CHECK (rent_type IN ('monthly', 'daily'));
ALTER TABLE shops ADD COLUMN IF NOT EXISTS daily_rate NUMERIC DEFAULT 0;

CREATE TABLE IF NOT EXISTS daily_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  collection_date DATE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  is_paid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, collection_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_collections_shop_id ON daily_collections(shop_id);
CREATE INDEX IF NOT EXISTS idx_daily_collections_date ON daily_collections(collection_date);
```

- [ ] **Step 2: Run migration in Supabase Dashboard (Manual)**
- [ ] **Step 3: Commit migration file**

---

### Task 2: Backend Routes
Create API endpoints to fetch and save daily collections.

**Files:**
- Create: `server/routes/dailyRoutes.js`
- Modify: `server/server.js`

- [ ] **Step 1: Create dailyRoutes.js**
```javascript
const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // Get collections for a shop in a date range
  router.get('/:shopId', async (req, res) => {
    const { shopId } = req.params;
    const { start, end } = req.query; // YYYY-MM-DD
    const { data, error } = await supabase
      .from('daily_collections')
      .select('*')
      .eq('shop_id', shopId)
      .gte('collection_date', start)
      .lte('collection_date', end);
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  // Toggle/Save collection for a date
  router.post('/', async (req, res) => {
    const { shop_id, collection_date, amount } = req.body;
    const { data, error } = await supabase
      .from('daily_collections')
      .upsert({ shop_id, collection_date, amount }, { onConflict: 'shop_id,collection_date' });
    if (error) return res.status(500).json(error);
    res.json({ message: 'Saved', data });
  });

  return router;
};
```

- [ ] **Step 2: Register route in server.js**
Add: `const dailyRoutes = require('./routes/dailyRoutes')(supabase);`
Add: `app.use('/api/daily', authMiddleware, dailyRoutes);`

---

### Task 3: Mobile Frontend - Shop Management
Allow users to mark a shop as "Daily" and set its daily rate.

**Files:**
- Modify: `client/src/pages/Shops.jsx` (Web Admin)
- Modify: `client/src/mobile/pages/MobileShops.jsx` (Mobile view)

- [ ] **Step 1: Add rent_type and daily_rate fields to Add/Edit Shop forms**

---

### Task 4: Mobile Frontend - Daily Collection Component
Build the Checklist UI for daily collection.

**Files:**
- Create: `client/src/mobile/components/DailyCollectionCard.jsx`
- Modify: `client/src/mobile/pages/MobileDashboard.jsx`

- [ ] **Step 1: Implement DailyCollectionCard**
- Component should fetch last 7 days.
- Show dates as horizontal buttons.
- Click to "Tick" (upsert to DB).
- Use Neumorphic active state for "Paid" days.

- [ ] **Step 2: Add to MobileDashboard**
- Filter shops where `rent_type === 'daily'`.
- Render a list of `DailyCollectionCard` components.

---

### Task 5: Final Review & Testing
- [ ] **Step 1: Verify on mobile device (Local Network)**
- [ ] **Step 2: Verify data in Supabase Dashboard**
- [ ] **Step 3: Commit all frontend changes**
