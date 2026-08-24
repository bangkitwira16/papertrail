# Architecture note

## Product decision

I optimized for one credible vertical slice instead of approximating every Google Docs feature. A reviewer can create a document, write and format content, observe autosave, refresh and reopen it, import a file, share it, switch users, and verify the access distinction end to end.

## Clean architecture boundaries

```text
Vue route adapters
  → document feature composables
  → typed document API client
  → Nitro HTTP adapters
  → document application service
  → DocumentRepository port
      ↳ atomic JSON adapter
      ↳ Supabase Postgres adapter

Domain policies ← application and infrastructure adapters
```

Dependencies point inward: persistence adapters implement an application-owned interface and depend on domain contracts; the domain has no Nuxt, Supabase, filesystem, or UI dependencies. The composition root selects an adapter from runtime configuration. Local evaluation requires no credentials, while deployment can use managed Postgres by setting two environment variables.

On the frontend, `app/features/documents` owns the feature vertically. Pages are thin composition adapters. API calls, list workflow state, autosave coordination, presentation helpers, and editor UI each have a single module-level responsibility.

## Code-splitting decisions

- Nuxt route splitting keeps dashboard and document-page code separate.
- Tiptap/ProseMirror is isolated in a `.client.vue` async component, so it is absent from the server-rendered dashboard path and does not execute during SSR.
- The sharing dialog is lazy-loaded only after an owner requests it.
- Editor toolbar code is colocated with the editor chunk instead of the application shell.

## Data model

- `app_users`: seeded identity records
- `documents`: title, Tiptap HTML content, owner, and timestamps
- `document_shares`: unique document/user grants

An owner can open, edit, and share a document. A shared user can open and edit it but cannot grant access. The API checks access on every document read and write rather than trusting the client-side UI.

## Reliability choices

- Title and content autosave changes are merged into one debounced update, avoiding lost updates when renaming and typing quickly.
- The local repository serializes mutations and writes through a temporary file plus atomic rename.
- Imported files are size/type checked and HTML-escaped before conversion.
- Zod limits title and content sizes at the API boundary.
- Save failures remain visible and do not falsely claim success.

## Production evolution

The first production hardening step is replacing seeded identities with Supabase Auth and policies tied to `auth.uid()`. Next would be viewer/editor permission roles, optimistic concurrency through document versions, then realtime presence and document updates. These are deliberately sequenced after the core editor and persistence flow.
