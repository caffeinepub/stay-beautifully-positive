# Specification

## Summary
**Goal:** Replace the single hard-coded background music track with a selectable set of upbeat, royalty-free tracks, including user controls and visible attribution.

**Planned changes:**
- Add a clearly editable frontend track list (e.g., `{ title, src, attribution }`) referencing upbeat royalty-free audio files served from static assets.
- Update music player logic to load/play the currently selected track, switch tracks during use, loop playback, and handle browser autoplay blocking without breaking the UI.
- Enhance MainPage music controls to include play/pause, volume control, and a track selector, plus an indicator showing the currently playing track name with upbeat/positive English labels.
- Display an unobtrusive in-app attribution section for the currently selected track using the attribution metadata in the track configuration.

**User-visible outcome:** Users can pick an upbeat background music track, play/pause it, adjust volume, see which track is playing, and view royalty-free attribution details in the app.
