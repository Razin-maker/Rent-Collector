# Daily Rent Collection Design Specification

**Date:** 2026-03-17
**Topic:** Daily Rent Collection for shops.

## 1. Problem Statement
The current system handles only monthly rent collection. Some shops have a daily rental agreement where rent is collected daily. Sometimes collection is missed for a few days, and then multiple days are collected at once.

## 2. Success Criteria
- [x] Distinguish between monthly and daily rental shops.
- [x] Record rent based on specific dates.
- [x] User-friendly mobile UI to tick off multiple days in one go.
- [x] Neumorphic design consistency.

## 3. Proposed Architecture
### 3.1 Backend (Database & API)
- **Database Schema**:
    - `shops`: `rent_type` (ENUM: monthly, daily), `daily_rate` (NUMERIC).
    - `daily_collections`: `shop_id`, `collection_date`, `amount`, `is_paid`.
- **API**:
    - `GET /api/daily/:shopId`: Fetch historical collection for current/past week.
    - `POST /api/daily`: Upsert a daily collection record.

### 3.2 Frontend (Mobile & Web)
- **Web Admin**: Add/Edit shop forms will include fields for `rent_type` and `daily_rate`.
- **Mobile Dashboard**:
    - Special section for "Daily Rent Tasks".
    - `DailyCollectionCard` component: Shows a shop's info and a horizontal list of dates (Last 7 days).
    - Interaction: Clicking a date button toggles its status (Paid/Unpaid).

## 4. Design Details
The "Checklist Style" uses a horizontal scrollable list of date bubbles. 
- **Green (Raised)**: Paid for that date.
- **Gray (Inset)**: Unpaid/Pending.
This follows the project's existing Neumorphic theme.

## 5. Security & Validation
- Ensure `shop_id` exists before inserting `daily_collections`.
- Only allow one entry per `(shop_id, collection_date)` using a UNIQUE constraint.
- User authentication required for all daily collection API calls.
