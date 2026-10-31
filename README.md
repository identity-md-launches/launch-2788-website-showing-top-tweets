# The Swamp

A dark green reader for the IdentityMD conversation, with original AI-equipped Pepe artwork. Browse 13 sourced tweets, search people and keywords, filter topics, switch between top and latest, and save posts in this browser.

The collection is a **31 October 2026 snapshot**. Top tweets means likes + reposts + replies within this ranked sample. The sample limit and count date are visible before the feed controls; this is not a live or exhaustive X ranking. Cards preserve the complete available text and paragraphs, with short links omitted. Every card links to the original post for attachments, quoted posts and thread context. Sources, captured counts, and selection limits are documented in [artifacts/sources.md](artifacts/sources.md).

## Install and develop

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. No credentials, API key, RPC, or backend is required.

## Preview and rebuild

```sh
npm run typecheck
npm run build
npm run preview
```

The complete static export is already included in `dist/`. Serve the contents of that directory on any static host. Vite uses `base: './'`; scripts, CSS, font, avatars, favicon, and artwork resolve relative to the hosting subpath. Feed and saved views use hashes, so server route rewrites are unnecessary. The export runs without third-party network requests; X and IdentityMD links open only when selected.

The editable site is in `src/`; local runtime assets are in `public/`. The share image’s editable vector source is `src/artwork/social.svg`. The finished `public/art/social.png` is included, so a normal build requires no image-generation tooling.

## Validate

```sh
npm run check:export
npx playwright install chromium webkit
npm run check:interactions
npm run check:interactions -- --webkit
```

Playwright may also need its Linux system dependencies (`npx playwright install-deps chromium webkit`). The interaction script starts and closes its own preview under `/preview/`, blocks external network requests, and writes temporary evidence under `test/scratch/validation/`. An optional `SWAMP_BROWSER_EXECUTABLE` points to a custom browser launcher when the environment needs one. It is not needed on a normal Playwright installation.

During this assignment, the pinned design probe was run from the repository root:

```sh
node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline
```

The pinned input is removed from the submission. The final probe results are retained in [artifacts/taste-results.json](artifacts/taste-results.json); the implementation and review are described in [DESIGN.md](DESIGN.md) and [artifacts/validation.md](artifacts/validation.md). Decisions for all 12 reviewer findings are recorded in [.imd-responses.json](.imd-responses.json).

## Validation results

Production build, TypeScript typecheck, and static-export integrity checks passed. All **17 interaction groups** passed in each of Chromium and WebKit, at 320, 390, 768, 1024, and 1440 CSS pixels where applicable. The first screen at 390×844 includes the sample description and count date, Explore the feed action, search, sorting, rank, and start of the first full tweet. The pinned taste probe passed **16/16** checks.

The browser checks cover keyword search, filters preserved by repeated feed anchors, combined filters, empty-state recovery, top/latest sorting including the added third-ranked post, bookmark persistence and removal, saved-view navigation, incremental loading, original-post links, keyboard access, dialog dismissal and focus return, 200% text enlargement, corrupted/denied storage, complete post text, visible mobile ranks/project information, matched search/select heights and readable options, accessible article/statistic names, and local asset loading with external networking blocked. Automated accessibility scans found no violations in the tested feed and dialog states. Full screen-reader sessions, physical devices, and browser-native zoom were not tested. Full results and fixed findings are in the validation record.

## Content and storage

- Edit `src/posts.ts` to update post text, dates, captured metrics, and editorial topics; update `SNAPSHOT_DATE` and the provenance document together, then rebuild `dist/`.
- Bookmarks use `localStorage` under `the-swamp:saved:v1`. They are local to the browser, not X bookmarks. If storage is unavailable, saves work for the visit with a visible explanation.
- X may require login or restrict access to posts. The static collection remains readable, and no availability of an external site is promised.
- There is no account, wallet, analytics service, or runtime feed API.

## Submission and credits

Source, package manifest, lockfile, configuration, documentation, and the finished export are included. The existing `.gitignore` retains its explicit 512-byte allowance in [artifacts/submission-budget.json](artifacts/submission-budget.json); dependency/cache directories are excluded at every depth, and `dist/` is intentionally included. Final delivery bytes are recorded in [artifacts/submission-integrity.json](artifacts/submission-integrity.json) and remain below 8 MiB.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for post, avatar, font, runtime, and pinned design-guide attribution.
