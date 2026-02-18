# Specification

## Summary
**Goal:** Show a brief celebratory message when an authenticated user completes a daily check-in that extends their streak.

**Planned changes:**
- Update the check-in success flow to compare the newly returned streak value from `updateDailyTracker()` with the previously cached/loaded streak value.
- Trigger a small, English celebratory message only when the new streak value is greater than the previous value (streak extended).
- Auto-dismiss the celebratory message after a short duration.
- Ensure the streak display remains accurate after check-in by refreshing/invalidating the streak query as needed.

**User-visible outcome:** After a successful daily check-in that increases their streak, signed-in users briefly see a celebratory message that disappears automatically; no message appears for failed check-ins, unauthenticated users, or same-day repeat check-ins.
