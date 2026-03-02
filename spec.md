# AI Video Studio

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Image-to-video project creation flow: upload image(s), enter text prompt, configure AI rendering settings
- Voice selection: male/female, Hindi/English language options (Coqui TTS compatible config)
- Music library: categorized background music tracks with preview metadata
- Auto subtitle toggle and configuration
- Video job queue: submit generation jobs, track status (pending/processing/complete/failed)
- Export settings: HD (1080p) / 4K resolution, no-watermark output
- Social share: copy link, share to social platforms
- Offline basic mode indicator vs online advanced AI rendering mode toggle
- User project history: list of past video generation jobs with status and download links
- HTTP outcall integration for dispatching jobs to external AI rendering endpoints (AnimateDiff, Stable Diffusion, Coqui TTS compatible)

### Modify
N/A (new project)

### Remove
N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - VideoJob type: id, owner, imageUrl, prompt, voiceGender, voiceLanguage, musicTrackId, subtitlesEnabled, resolution, status, createdAt, resultUrl
   - MusicTrack type: id, name, category, durationSecs, previewUrl
   - CRUD for video jobs: createJob, getJob, listUserJobs, updateJobStatus
   - Predefined music library (seed data in frontend only)
   - HTTP outcall stub for dispatching jobs to AI rendering backend
   - Query: getUserJobs, getJobById
   - Update: submitJob, cancelJob, markComplete (admin/system)

2. Frontend:
   - Landing/home page with hero section explaining the app
   - Create Video page: multi-step wizard (upload image -> prompt + voice -> music -> export settings -> submit)
   - Job dashboard: list of user's video jobs with status badges and action buttons
   - Music library modal/picker with track categories
   - Voice selector component (gender + language)
   - Resolution picker (HD/4K)
   - Subtitle toggle
   - Job detail page: status, preview placeholder, download/share buttons
   - Mode toggle: Offline Basic / Online Advanced AI
   - Responsive mobile-first layout
