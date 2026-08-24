# Submission contents

## Included

- Complete Nuxt/Vue source code
- Tailwind CSS responsive UI
- Tiptap rich-text editor
- Markdown export stretch feature
- Nuxt server API routes
- Local persistence and Supabase production adapters
- Supabase SQL schema and seed users
- Automated tests
- `README.md` with setup, demo users, limitations, and deployment instructions
- `ARCHITECTURE.md`
- `AI_WORKFLOW.md`
- `VIDEO_URL.txt`

## Verified

- `pnpm test`: 7 tests passing
- `pnpm build`: production build passing
- Browser verification: create, rename, edit, autosave/reopen, and share flows passing

## Links to complete before submission

- Live product URL: https://papertrail-six-hazel.vercel.app/
- Google Drive folder: `TODO`
- Walkthrough video: https://github.com/bangkitwira16/papertrail/releases/tag/walkthrough-v1

## Known limitations

- Authentication is simulated with three seeded users.
- Sharing grants edit access only; roles are not configurable.
- No realtime collaboration, comments, version history, or PDF export.
- `.md` import preserves text and paragraph breaks but does not parse Markdown formatting.

## Next 2–4 hours

1. Add Supabase Auth and user-scoped RLS policies.
2. Add viewer/editor sharing roles.
3. Add lightweight version snapshots and restore.
