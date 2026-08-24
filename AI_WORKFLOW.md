# AI-native workflow note

## Tools used

- Codex for requirement decomposition, implementation, test creation, and browser-driven verification
- Official Nuxt, Tailwind CSS, and Supabase documentation to confirm current framework and deployment patterns
- Browser automation against the production Nuxt build for end-to-end behavior checks

## Where AI materially accelerated the work

AI compressed the initial architecture and scaffolding phase, generated the repetitive API and UI foundations, and helped keep the assignment requirements traceable across the product. It was particularly useful for implementing the dual repository boundary and producing reviewer-focused documentation alongside the code.

## Output changed or rejected

- Nuxt 3 was rejected in favor of Nuxt 4 because Nuxt 3 had reached end of support while Nuxt 4 still uses Vue 3.
- A cloud-only database was rejected because it would make local review depend on external credentials. The final design keeps Supabase for production and a zero-config local persistence adapter.
- A broader Google Docs clone was rejected in favor of a smaller, polished create/edit/import/share flow.
- The first autosave implementation was changed after browser testing exposed a race between pending title and content updates. The final implementation merges both changes before saving.

## Verification

- Ran four automated tests covering document access rules, owner-only sharing, filename conversion, and safe file import.
- Ran a full production build with Nuxt type checking enabled.
- Opened the production build in a browser and verified seeded data, document creation, rich-text editor loading, title/content autosave across refresh, and owner sharing.
- Kept validation and authorization on the server rather than relying on hidden or disabled client controls.

AI generated implementation candidates; product scope, architecture choices, security boundaries, and acceptance decisions remained human-directed engineering judgment.
