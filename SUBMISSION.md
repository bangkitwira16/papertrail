# Papertrail — Full-Stack Assessment Submission

Papertrail is a focused collaborative document workspace built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Tiptap, Nitro server routes, and Supabase. It supports the complete document flow from creation and rich-text editing through persistence, search, sharing, and reopening.

## Submission links

- Google Drive deliverables folder: https://drive.google.com/drive/folders/1HRdjFXFvc6rIgsIn4vbyDOXYr9apf9v8?usp=drive_link
- Live product: https://papertrail-six-hazel.vercel.app/
- Source repository: https://github.com/bangkitwira16/papertrail
- Walkthrough video: https://drive.google.com/file/d/1JPTxjumhyKYudczQnoL_Z-KRxS_rI1uJ/view?usp=drive_link

## Reviewer quick start

1. Open the live product. It starts as Alex Morgan.
2. Create a document, rename it, apply rich-text formatting, and observe the autosave status.
3. Use **Share** and add `maya@papertrail.test`.
4. Open the profile menu, switch to Maya Chen, select the **Shared** filter, and open the shared document.
5. Edit the document as Maya to verify shared access end to end.
6. Use **Markdown** in the editor toolbar to test the optional export enhancement.

No password is required. The seeded demo identities are:

- Alex Morgan — `alex@papertrail.test`
- Maya Chen — `maya@papertrail.test`
- Sam Rivera — `sam@papertrail.test`

## Implemented scope

- Create, rename, edit, autosave, reopen, search, and filter documents.
- Rich-text formatting: headings, bold, italic, underline, lists, blockquotes, undo, and redo.
- Import `.txt` and `.md` files up to 1 MB with validation and safe text handling.
- Owner-only sharing with seeded users by email and shared-document editing.
- Supabase-backed production persistence through server-only API access.
- Local JSON persistence fallback for development.
- Responsive, componentized Vue UI with typed composables, repositories, domain models, and API validation.
- Optional stretch feature: export the current document as a Markdown file with a safe filename.

## Architecture and engineering quality

The application uses a clean boundary between presentation components, reusable composables, typed domain contracts, Nitro API handlers, and repository adapters. The frontend never receives the Supabase secret key. Production uses Supabase, while the repository interface allows local development and testing without coupling the UI to storage.

Quality checks completed:

- `pnpm test` — 7 automated tests passing across 4 test files.
- `pnpm typecheck` — passing.
- `pnpm build` — production build passing.
- Live browser verification — create, rename, edit, autosave/reopen, search, sharing, shared editing, and Markdown export checked.

## AI-native workflow

I used OpenAI Codex to accelerate requirements synthesis, initial scaffolding, modular refactoring, test and documentation drafting, deployment-log diagnosis, and repeatable browser verification. I changed or rejected generated output where it conflicted with the intended architecture or deployment model, including client-side secret usage, filesystem persistence on Vercel, overly coupled components, and incomplete validation. Correctness was verified with automated tests, TypeScript checks, a production build, deployment logs, and manual end-to-end testing of the live application.

## Drive folder contents

- Complete source code.
- `README.md` with local setup, run, and deployment instructions.
- `ARCHITECTURE.md` describing priorities and tradeoffs.
- `AI_WORKFLOW.md` describing practical AI usage and verification.
- `SUBMISSION.md` with this submission inventory and reviewer notes.
- `VIDEO_URL.txt` containing the walkthrough URL.
- Walkthrough video and packaged source archive.

## Intentional limitations

- Authentication is represented by three seeded demo identities rather than production sign-in.
- Sharing currently grants edit access only; viewer/editor roles are not configurable.
- Realtime presence, comments, version history, and PDF export were deprioritized.
- Markdown import preserves content safely as text and paragraph breaks rather than parsing all Markdown syntax.

## What I would add with another 2–4 hours

1. Supabase Auth with user-scoped row-level security policies.
2. Viewer/editor sharing permissions.
3. Lightweight document version snapshots with restore support.
