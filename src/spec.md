# Specification

## Summary
**Goal:** Remove background music playback and all music controls from the main page.

**Planned changes:**
- Delete all background audio playback logic from the main page (Audio element creation, play/pause, volume, and track-switching side effects).
- Remove all music-related UI from the main page (header play/pause control and the full “Music Controls” panel including track selection, volume, now-playing text, and attribution).
- Eliminate dependency on the music track list by removing imports/usages of `frontend/src/music/tracks.ts`.

**User-visible outcome:** The app loads and runs with no background music and no music controls visible; the daily message and motto remain intact and appropriately centered.
