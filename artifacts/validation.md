# Validation and consolidated design review

Status: **Complete for the stated scope.** This is the worker’s own validation record, not independent certification. Production assets, source, lockfile, documentation, and actual evidence are included.

| Area | Final result |
| --- | --- |
| Brief and acceptance requirements | 9 covered, 0 missing or faked |
| Broken primary features found in final checks | 0 |
| Product and source action on the first screen at 390×844 | Yes, Chromium and WebKit |
| Pinned taste@1 probe | 16/16 passed |
| Interaction validation | 15/15 groups in each browser |
| Automated accessibility scan | 0 violations in tested feed and dialog states, both browsers |
| Copy findings remaining | 0 |
| Share metadata | Title, favicon, description, og:title, og:image present; local 1200×630 PNG inspected |

## Scope and assumptions

The requested site is a static reader for tweets about IdentityMD, with dark green styling and Pepe agents equipped with AI hardware. Its one visual idea is an orderly green feed carried by an original tactical Pepe squad illustration.

No live feed, account, wallet, or backend was specified. The implementation uses an explicitly dated editorial collection of 12 real public post excerpts from four accounts. “Top tweets” ranks this collection by captured likes + reposts + replies; “Latest” uses original UTC timestamps. It does not claim an exhaustive X ranking. The Snapshot dialog and end-of-feed date explain the data. Provenance, exact source URLs, captured counts, and selection limits are in [sources.md](sources.md). Bookmarks are explicitly local to the browser.

Reviewed flows: initial feed, keyword search, combined search/topic filtering, empty search, topic-chip filtering, top/latest sorting, saved view, save/reload/remove, empty saved view, incremental loading, external original-post links, About dialog, keyboard navigation, storage denial/corruption, responsive reflow, text enlargement, and asset loading without external networking. No credentials or on-chain interactions are needed.

The supplied browser tool failed to initialize because its configured Chrome distribution was absent. Actual rendering and interaction validation was completed with isolated Playwright Chromium and WebKit installations instead. WebKit needed isolated system libraries and a software-rendering launcher; those test dependencies are outside the delivery. No required browser observation is inferred from source alone.

## Requirement coverage

| Requirement | Result and implementation |
| --- | --- |
| “A website showing the top tweets about identity MD” | Met: sourced excerpts, observed engagement, top/latest ordering, original permalinks in `src/posts.ts` and `PostCard.tsx` |
| “dark green with a theme of pepes armed with AI” | Met: forest/lime palette and original squad, circuit blaster, scout drone, and frog mark |
| “usable website … working primary interactions and responsive layouts” | Met: actual browser checks described below; five viewport widths |
| “dist/index.html and its assets … alongside the source and lockfile, with relative asset URLs” | Included for the automatic Git submission: `dist/`, source, manifest and lockfile are present; Vite base is `./`; export is not ignored. No manual `.git/` mutation was performed. |
| “production build, typecheck and useful interaction validation … actual results and limitations” | Met: successful production build/typecheck, export validation, 15 browser interaction groups per engine; evidence retained |
| “applies … Better Interface … six domains … fixes … records coverage, findings and limitations” | Met: workflow and all six core domains read and applied during implementation; consolidated review below; root `DESIGN.md` describes final source |
| “first screen at 390 … product and main action … title, favicon, description, og:title and og:image” | Met: both browser first-screen checks include headline, search, first excerpt and View on X; metadata and actual share image checked |
| “DESIGN.md … tokens, typography, components and responsive behavior” | Met: source-derived document with implemented values and verification limits |
| “README … install, preview and rebuild” | Met: standard npm commands, static-hosting behavior, data-update instructions, checks, results and limits |

Hosting and the final publisher-assigned address are outside this assignment. The export and all required runtime files are complete; no production URL is guessed.

## Six-domain review

| Domain | Coverage and evidence | Unperformed / not applicable |
| --- | --- | --- |
| Accessibility | **Checked.** Native links/buttons/search/select/dialog; real labels and names; heading/landmark outline; skip link; live counts/save status; explicit focus perimeter; keyboard skip/search/dialog paths, Tab and Shift+Tab containment, Escape/backdrop/close and focus return; removal focus recovery; axe scans; reduced-motion source and probe; targets pass probe baseline. | No screen-reader session, physical-device/touch keyboard test, native browser zoom, or rendered forced-colors check. A snapshot or axe result is not represented as a screen-reader test. Transaction and media controls are not applicable. |
| Layout | **Checked.** Shared edges, controls preceding content, grid collapse, overflow, first-screen placement, full names and readable source actions. Browser widths 320, 390, 768, 1024, 1440; 200% root-text enlargement. Artwork clipping is confined to the hero. | No translated copy or RTL version; ≥1500px branch reviewed in source but not rendered. English is the supported language. |
| Writing | **Checked.** Button labels match actions; search labels persist; recovery explains a next step; static sample, excerpt status, capture date, local saves and ranking method are explained. Authors’ historic claims remain attributed. No invented live counters, verified badges, likes/reposts, or account sync. | Locale translation and financial claims inside linked authors’ posts were not independently evaluated. No consequential form or payment flow exists. |
| Typography | **Checked.** Local Manrope; 400/500/700; six-token scale, five visible sizes per probe viewport; heading order, measure, wrapping, numerical stability, 16px mobile inputs, full handles, text enlargement. Screenshots inspected at phone and desktop sizes in both engines. | Native 200% browser zoom and OS font substitution beyond the bundled font were not tested. |
| Colors | **Checked.** Shared primitive/semantic tokens and section-local art surfaces reviewed; actual computed solid foreground/background pairs measured; all selected pairs exceed 4.5:1. Caption’s own solid backing measured 9.40:1. State also has shape/text/semantics. | Probe conservatively marks the caption as overlapping artwork, so it omits that one pair; the separate rendered CSS measurement covers its solid backing. Decorative SVG art is not evaluated as body text. No alternate theme is implemented. |
| UI | **Checked.** Flat tonal layers, structural borders without shadows, consistent icon set, readable selected states, working empty/error states, focus recovery, and restrained hover/press motion. Reduced-motion probe finds no endless animation or `transition: all`. Final PNG and SVG art inspected. | No 10%-speed Animations-panel replay was performed. There are only 150ms hover/press transitions; staged animation, autoplay, loading, and theme-switch states are not applicable. |

## Findings and corrections

All applicable findings below were corrected. Citations point to the final source rules or handlers. No unresolved high or medium findings remain.

### High: illustration caused horizontal overflow

- Source: `src/styles.css:54`, `.hero { … overflow:hidden … }`, and `src/styles.css:61`, `.hero-art`.
- Before: the first probe measured document widths of 358px at a 320px viewport and 414px at 390px. The absolutely positioned illustration extended past the panel.
- Change: clip the artwork at the hero’s existing rounded boundary. Text and controls retain their inset space.
- Recheck: taste layout passes at 320/390/1440 with no overlaps or text clipping; both engines also pass at 768 and 1024. The final 390 screenshots confirm the panel edge.

### High: About dialog did not wrap keyboard focus

- Source: `src/components/AboutDialog.tsx:14`, native dialog `onKeyDown` handler.
- Before: the Chromium keyboard check found focus outside the dialog after cycling past its last control.
- Change: explicitly wrap Tab/Shift+Tab between the native dialog’s first and last controls; retain native inert/modal semantics, Escape dismissal and trigger focus return.
- Recheck: forward/reverse keyboard cycle, Escape, close and backdrop all pass in Chromium and WebKit. Background scrolling is locked by `src/styles.css:18`.

### Medium: enlarged text exceeded phone width

- Source: `src/styles.css:66`, `:72`, `:84`, `:99`, `:104`, `:107`, and `:197` (heading/filter/toolbar/context/footer wrapping and rem-based select widths).
- Before: at 390px with 200% root text, the browser assertion detected `scrollWidth > innerWidth`.
- Change: allow grouped rows to wrap, let handles break as needed, and size topic fields in rem units rather than fixed pixels.
- Recheck: both browsers pass 200% text enlargement at 390 without horizontal overflow. This is text enlargement, not a claim of browser-native zoom testing.

### Medium: skip link could switch the saved view

- Source: `src/App.tsx:100`, skip link click handler.
- Before: source review showed `#feed` was both a skip target and the route that reset the view to the full feed.
- Change: focus and scroll the existing feed section without changing the hash or saved view.
- Recheck: the keyboard test activates the skip link while in Saved, confirms Saved remains active, and confirms focus is on the content section in both engines.

### Medium: removing a saved post removed its focused control

- Source: `src/App.tsx:72`, `toggleSave`.
- Before: source review found no focus destination when the focused saved card was removed.
- Change: focus another saved action or the empty-state Explore link after the DOM updates.
- Recheck: remove-last-saved path reaches the empty-state link with focus, in both engines.

### Low: caption lacked an independently measurable backing

- Source: `src/styles.css:62`, `.hero-caption`.
- Before: the probe flagged the caption’s overlap with the artwork as an unmeasured contrast pair. No failing ratio was assumed.
- Change: give the existing caption a solid backing matching the hero and measure the actual rendered pair separately.
- Recheck: `rgb(189,207,175)` over `rgb(21,40,27)` is **9.40:1**, confirmed in the browser contrast record. The probe’s geometry-based exception remains documented.

### Low: composed share artwork inherited black fills

- Source: `src/artwork/social.svg:1`, the translated squad group with `fill="none"`.
- Before: inspection of the first raster showed black fills in open illustration paths because the original SVG root’s fill rule was lost when composing the share image.
- Change: preserve `fill="none"` on the embedded illustration group and regenerate the PNG.
- Recheck: the corrected 1200×630 local PNG was opened and visually inspected; no unintended black patches remain.

Additional build correction: an early pinned Vite version produced one high audit advisory. Dependencies were updated and relocked. The final npm audit reports **0 vulnerabilities**. Browser-library setup failures and early asynchronous/lazy-image assertions were resolved in the isolated verification harness; they are not claimed as shipped application defects.

## Commands and actual results

Dependencies were installed in an isolated copy so no dependency directory is part of the repository. Build input files were synchronized from the repository; the final export was copied back. The commands below are the scripts executed within that copy. Temporary launcher/cache path flags are environment-only and are not required in the submitted source.

| Command | Actual outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Locked dependencies installed successfully in the isolated build directory |
| `npm run build` | Exit 0; TypeScript and Vite 7.3.7 production build completed; 33 modules transformed |
| `npm run typecheck` | Exit 0; `tsc --noEmit` |
| `npm run check:export` | Exit 0; 12 export files, relative references resolve, no dependency archives/maps, metadata present; 513,684 export bytes |
| `npm run check:interactions` | Exit 0; **15/15 groups** in Chromium |
| `npm run check:interactions -- --webkit` | Exit 0; **15/15 groups** in WebKit, using the isolated launcher |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline` | Exit 0; **16/16 checks** against the actual export from the repository root |
| `npm audit --json` | Exit 0; **0 vulnerabilities** in the final lockfile |

The 15 interaction groups verify: first-screen product/source action; search and no-result recovery; native topic plus combined search and topic chips; top/latest sorting; save/saved route/reload/removal; incremental loading with focus; real original-post URL shapes and safe new tabs; dialog dismissal and focus; keyboard skip and visible search focus; five responsive widths; axe feed/dialog scans; text enlargement; corrupted storage; denied storage with usable session bookmarks; and complete local images with zero page/console errors or missing resources while external networking is blocked. Expected request cancellation during the test’s own navigation/reloads is excluded from resource failures.

Browser preview runs under `/preview/` to verify gateway/subpath behavior. No external feed API is called by the export. Every original tweet permalink was separately fetched successfully during sourcing; future availability or X login requirements are outside the static site’s control.

## Retained evidence

- [Interaction results](interaction-results.json): actual final per-browser results.
- [Accessibility results](accessibility-results.json): zero violations, pass IDs, and incomplete check IDs for feed/dialog in both browsers. Incomplete checks are not converted to passes.
- [Measured rendered contrast pairs](contrast.json): actual foreground/background values and ratios.
- [Pinned taste results](taste-results.json): all 16 final check outputs.
- [Chromium first screen, 390×844](screenshots/mobile-390.png).
- [WebKit first screen, 390×844](screenshots/webkit-mobile-390.png).
- [Desktop first screen, 1440×900](screenshots/desktop-1440.png).
- [About dialog at 390](screenshots/about-390.png).
- [Keyboard focus at 390](screenshots/keyboard-focus-390.png).

The screenshots listed above were actually generated and inspected. Additional 320/768/1024/1440, focus and enlarged-text evidence was generated in scratch during the run; scratch is intentionally excluded from the delivery.

## Delivery integrity and limitations

The complete local export contains only the HTML entry, generated JS/CSS, local Manrope font/license, four author avatars, frog favicon, squad SVG, and share PNG. No source map, unused composed SVG, dependency archive, registry mirror, cache, or submodule is required. The editable share SVG remains in the source. `.gitignore` has an explicit path allowance in `submission-budget.json`; `dist/` is included.

The data is intentionally a limited dated collection. A live exhaustive X feed would require a separate authorized data service. Saves are browser-local and unsynced. No native screen-reader, real iPhone/Safari, physical touch/keyboard, native zoom, Firefox, translation/RTL, or rendered forced-colors checks were performed. Automated axe/probe results are bounded evidence, not complete accessibility certification. The publisher assigns the final address, so `og:image` is relative as required for the export; no live social-crawler unfurl at a production domain was tested.

Path allowances are recorded in `submission-budget.json`; actual final bytes and hashes are in `submission-integrity.json`. The complete delivery fits within the 8,388,608-byte limit.
