# Papertrail

Papertrail is a focused collaborative document workspace built for the Ajaia AI-Native Full Stack Developer assignment. It prioritizes a coherent end-to-end product slice: create a document, write with rich-text tools, autosave it, import an existing file, and share it with another seeded user.

## What works

- Create, rename, edit, save, refresh, and reopen documents
- Bold, italic, underline, H1/H2, bulleted and numbered lists, blockquotes, undo, and redo
- Debounced autosave with visible saving, saved, and error states
- Import `.txt` and `.md` files up to 1 MB into new editable documents
- Seeded user switcher for `Alex`, `Maya`, and `Sam`
- Owner/shared document filtering and document-level access checks
- Owner-only sharing by seeded-user email
- Local file persistence with atomic writes and a Supabase Postgres production adapter
- Responsive dashboard and editor layouts
- Validation for document data, share emails, file type, and upload size
- Automated access-control, application-service, and safe-import tests

## Stack

- Nuxt 4 and Vue 3
- TypeScript
- Tailwind CSS 4
- Tiptap/ProseMirror rich-text editor
- Nuxt/Nitro server routes
- Zod validation
- Supabase Postgres in production; atomic JSON file store for zero-config local review
- Vitest

## Project structure

```text
app/
  components/                 Shared application-shell UI
  features/documents/
    api/                      Typed HTTP client
    components/               Document presentation and lazy editor UI
    composables/              Library and editor workflows
    domain/                   Frontend document contracts
    utils/                    Presentation-only helpers
  pages/                      Thin route composition

server/
  domain/documents/           Models and access policies
  application/documents/      Use cases, repository port, validation
  infrastructure/persistence/ File and Supabase adapters
  api/                        Thin HTTP adapters
  utils/document-service.ts   Dependency-composition root
```

Routes own navigation and layout only. Feature composables own interaction state, the typed client owns HTTP details, application services own use-case orchestration, and repositories own storage mechanics.

## Code splitting

- Nuxt automatically generates route chunks for the workspace and document routes.
- The Tiptap editor is isolated in `DocumentEditor.client.vue` and loaded asynchronously only on a document page.
- The share dialog is a separate async component loaded only when an owner opens it.
- Server routes bundle against the repository interface and select the file or Supabase adapter at the composition root.

## Local setup

Requirements: Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

No environment variables are required. On first use, the app creates `.data/papertrail.json` and seeds three demo users plus two documents.

### Demo users

| User | Email | Purpose |
| --- | --- | --- |
| Alex Morgan | `alex@papertrail.test` | Default owner |
| Maya Chen | `maya@papertrail.test` | Sharing target and owner of a shared seed document |
| Sam Rivera | `sam@papertrail.test` | Additional sharing target |

Use the profile switcher in the header to demonstrate access from another user's perspective.

## Test and build

```bash
pnpm test
pnpm build
pnpm preview
```

## Production database: Supabase (recommended)

Supabase is the recommended backend because it provides managed Postgres, a useful free tier, and a clean path to adding real authentication and realtime features later. All current database requests originate in Nitro server routes, so the service-role key is never exposed to browser code.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor.
3. Configure these server-side environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-only-sb-secret-key
```

4. Deploy the Nuxt app to Vercel, Netlify, Railway, Render, or another Nitro-compatible provider.

Never prefix `SUPABASE_SECRET_KEY` with `NUXT_PUBLIC_` and never commit it. The legacy `SUPABASE_SERVICE_ROLE_KEY` name remains supported for compatibility.

### Why include a local adapter?

The assignment explicitly allows a documented local file store. The local adapter makes evaluation take one command and demonstrates persistence after refresh without requiring reviewers to provision a cloud account. Supabase is selected automatically when both Supabase variables are available.

## API overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/users` | List seeded users |
| `GET` | `/api/documents?userId=…` | List accessible documents |
| `POST` | `/api/documents` | Create a document |
| `GET` | `/api/documents/:id?userId=…` | Open an accessible document |
| `PATCH` | `/api/documents/:id` | Rename or edit a document |
| `POST` | `/api/documents/:id/share` | Owner grants a seeded user access |
| `POST` | `/api/documents/import` | Import a text or Markdown file |

## Intentional scope cuts

- Seeded identities replace production authentication.
- Shared users receive editor access; viewer/editor roles are not implemented.
- Collaboration is persisted but not realtime.
- Markdown files are imported as safely escaped plain text with paragraph structure, not full Markdown syntax rendering.
- Attachments, comments, version history, offline sync, and export are out of scope.

With another 2–4 hours, the next priorities would be Supabase Auth plus RLS, viewer/editor sharing roles, then lightweight document version snapshots.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`AI_WORKFLOW.md`](./AI_WORKFLOW.md), and [`SUBMISSION.md`](./SUBMISSION.md) for reviewer-focused notes.
