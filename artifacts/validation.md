# Validation and consolidated design review

Status: **Complete for this revision's stated scope.** These are the worker's own checks, not independent certification. The accepted React/Vite structure, artwork and interaction model were retained. All 12 reviewer reports were reproduced and addressed; one answer per full finding ID is in [the revision responses](../.imd-responses.json).

| Area | Final result |
| --- | --- |
| Production build / typecheck | Passed; Vite 7.3.7, 33 modules, `tsc --noEmit` |
| Production export | 13 files, 517,838 bytes; relative assets and metadata checked |
| Interactions | 17/17 groups in Chromium 156 and 17/17 in Linux WebKit 27.2 |
| First screen at 390×844 | Sample/date, Explore the feed, search, sorting, rank and beginning of the first full tweet visible in both engines |
| Pinned taste@1 probe | 16/16 passed on the final export with external networking blocked |
| Automated accessibility | Zero violations in the tested feed/dialog states, both engines |
| Data | 15 public references checked, 13 relevant posts included; complete rendered bodies and captured counters verified |
| Share metadata | Title, favicon, description, og:title and local 1200×630 og:image present |

## Scope and assumptions

The site reads public tweets about IdentityMD, with a dark green feed and an original squad of Pepe agents equipped with AI hardware. No wallet, transaction, backend or live feed was requested; wallet checks are not applicable.

The collection is explicitly a **ranked sample**, now 13 posts from five accounts, counted on 31 October 2026. The hero discloses the sample and the information button shows the date before the feed controls. Top tweets orders the collection by likes + reposts + replies, breaking ties by date; Latest uses original UTC timestamps. Ranks always describe engagement within this collection. An exhaustive ranking requires an authorized X search/API source or dataset from the requester, which the brief does not supply. No global or live coverage is implied.

Every recursively reachable quoted-post reference from the original twelve cards was followed to its own public page. Full public-page note text was preferred over truncated syndication previews. Short links, trailing spaces and excess blank lines are omitted; entities are decoded and author words, punctuation, glyphs and paragraphs remain. Media, quoted cards and thread replies are reachable through original links. [sources.md](sources.md) records counts, sources, inclusion decisions and data limits. Authors' factual and financial claims were not independently verified.

Reviewed flows: initial feed; search/combined filters; filter and loaded-count preservation under repeated feed anchors; real Feed/Saved transitions; empty-state recovery; top/latest ranking; save/reload/remove; corrupt/denied storage; loading 6, then 6, then 1 post; original links; dialog keyboard focus/dismissal; skip/search focus; visible mobile project/people; responsive reflow; 200% root-text enlargement; local resources with external requests blocked.

The supplied browser tool could not initialize because its configured Chrome distribution was absent. Rendered checks instead used isolated Playwright Chromium and WebKit. WebKit needed isolated libraries and a software-rendering launcher; those dependencies and caches remain outside the repository. No rendered observation is inferred from source alone.

## Acceptance coverage

The sourced ranked sample, complete available tweet text and original links implement the requested reader. Existing tactical Pepe art and the corrected green ramp implement the requested look. Both engines exercised the interactions at 320, 390, 768, 1024 and 1440 CSS pixels, without horizontal overflow. The initial 390 screen exposes the product and primary action, and all required metadata is present. The finished `dist/`, source, manifest and lockfile are included for automatic submission, with Vite base `./` and hash navigation. Root `README.md` documents install, preview, rebuild and checks; root `DESIGN.md` records the final source-derived system.

Hosting and the final URL belong to the publisher after submission. Relative og:image is deliberate; no production social-crawler unfurl was tested.

## Better Interface coverage

All six core domains were read and applied to the affected components during corrections, then checked against the finished export. Attribution and pinned licenses remain in `THIRD_PARTY_NOTICES.md` and `artifacts/design-guidance-licenses.txt`.

| Domain | Checked | Unperformed / not applicable |
| --- | --- | --- |
| Accessibility | Native controls/dialog; persistent labels; author/date article names and named stats; visible mobile ranks; skip/search keyboard focus; Tab/Shift+Tab, Escape/close/backdrop and focus return; saved-removal recovery; live statuses; axe feed/dialog scans; reduced-motion/target probe | No native screen-reader session, physical-device keyboard/touch test or forced-colors rendering. Compact targets pass the 24px/spacing baseline; some are below the comfortable 44px preference. |
| Layout | Shared edges, controls before content, wrapping, stacked project/people sidebar; normal phone copy clear of artwork; first-screen product; five viewport widths; 200% root-text enlargement | No native browser zoom, translation or RTL run. The ≥1500px branch was reviewed in source, not rendered. English is the shipped language. |
| Writing | Visible sample/date, accurate ranking/local saves, complete attributed text, short placeholder, noun headings, fewer competing lines, unsupported ownership claims removed, recoverable empty states | Authors' historic claims and external-site uptime not independently verified. No payment/consequential form exists. |
| Typography | Local Manrope 400/500/700, six-token scale, five visible sizes per probe viewport, 16px phone inputs, paragraph preservation, 68ch post measure, full wrapping handles, tabular counts, readable options | No OS font-substitution study or native zoom. Quoted author casing, punctuation and emoji are retained. |
| Colors | Existing semantic tokens; six green primitives corrected; matching theme-color; seven actual solid foreground/background pairs measured in both engines, all ≥4.5:1; selected states have non-color cues | Measurements resolve solid backgrounds, not every pixel of the decorative art/radial hero. No alternate theme requested or added. |
| UI | Existing flat surfaces/borders; palette chevron with native select behavior; matched 48px phone controls; save/sort/topic states; empty/storage-error states; 150ms hover/press transitions and reduced motion | No 10%-speed Animations-panel replay. Loading, autoplay, transaction and theme-switch states are absent. |

## Reproduced findings and corrections

The full details are in [`.imd-responses.json`](../.imd-responses.json). [revision-evidence.json](revision-evidence.json) retains before/after measurements, accessibility snapshots and source checks; its before states intentionally describe the original defects.

| ID prefix | Final source | Evidence, correction and recheck |
| --- | --- | --- |
| `077cf180` | `src/posts.ts:175`, `src/App.tsx:116`, `src/App.tsx:122` | Missing thesis totals 297 versus old #03's 197. Added it at #03, followed quote references, rechecked counts and disclosed sample/date. Both suites assert the new rank and visible disclosure. |
| `f6c50376` | `src/posts.ts:12`, `src/components/PostCard.tsx:20`, `src/styles.css:100` | All 12 original cards appended ellipses. Restored full available public-page text and paragraphs/glyphs, removed excerpt UI and mobile whitespace collapse. All 13 DOM bodies per engine match normalized captured source text. |
| `4ab6cdb0` | `src/styles.css:190` | Original opacity .6 at 390/.5 at 320 plus mask/clip. Removed them; 58% art and 18ch copy. Final opacity 1 and no mask/clip-path; screenshots inspected, no overflow. |
| `3a9198c5` | `src/styles.css:5`, `index.html:6` | Original root rgb(11,19,14) read near-black in screenshots. Existing ramp now yields rgb(15,33,22) root and rgb(20,41,27) cards. Updated theme-color and measured contrast again. |
| `f4b5b610` | `src/styles.css:194`, `src/components/PostCard.tsx:17` | Phone ranks were display:none and absent from the accessibility tree. Removed hiding; visible #01 and accessibility snapshot confirmed, all checked widths without overflow. |
| `567c479a` | `src/styles.css:183` | Sidebar hid the only project link and all people below 901px. Only duplicate topics now hide; project/people/note stack after feed. Both engines verify the project link and five people at every width. |
| `46d420ea` | `src/App.tsx:44`, `src/App.tsx:48` | Both engines reproduced oracle/3 results becoming empty/12 on first anchor only. Route ref resets only for real view changes. Final oracle/4 survives both clicks; topic, loaded count and desktop nav also checked. |
| `fa69e2a9` | `src/styles.css:81`, `src/styles.css:192` | WebKit select was 54px versus search 48px, labels 6px apart; Chromium 46px versus 48px. Native select now has appearance:none/chevron; both phone controls 48px, labels align, all options fit and selection works. |
| `bdf762c6` | `src/App.tsx:116`, `src/App.tsx:139`, `src/App.tsx:147` | Confirmed competing caption/sidebar/footer lines. Removed them, renamed headings Tweets/Topics, footer uses brand. Art feet uncovered and topic list moves up. Copy/slogan probe passes. |
| `ee4ef5e9` | `src/components/AboutDialog.tsx:25`, `src/App.tsx:147` | Unsupported independence claims confirmed and removed from UI and corresponding README/DESIGN/attribution text. Dialog gives computed count/date; both engines checked. |
| `b1466ba4` | `src/App.tsx:124` | Placeholder needed 206px Chromium/210px WebKit for 93–145px room. Keywords needs 70px/71.40px and fits the final 73px minimum room at 320; visible label retained. |
| `a05dfee8` | `src/components/PostCard.tsx:8`, `src/components/PostCard.tsx:23` | Original article used its profile-link name and generic stats lost their label. Both final snapshots expose Post by Adam, Oct 7 and group Engagement at the snapshot date. |

The thirteenth post also exposed a singular Load 1 more post state; its label was corrected and that final loading step is exercised. Existing skip behavior, dialog trap/focus return, saved-removal focus, storage handling and local packaging remain intact and pass their checks.

## Commands and actual results

Dependencies were installed in an isolated copy, then repository build inputs and checks were synchronized there. The successful export was copied back to `dist/`, replacing obsolete generated bundles. Final source/check inputs and exports were compared byte for byte. Interaction/export scripts were invoked through Node from the repository, using the synchronized isolated script files to resolve dependencies; the table gives their equivalent npm script names. Temporary module/browser/library path flags are environment-only, not delivered requirements.

| Command | Actual outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Locked dependencies installed in isolated directory; manifest and lockfile unchanged |
| `npm run build` | Exit 0; TypeScript and Vite 7.3.7, 33 modules |
| `npm run typecheck` | Exit 0; `tsc --noEmit` |
| `npm run check:export` | Exit 0; 13 files, 517,838 bytes, relative assets resolve, metadata present, no maps/dependency archives |
| `npm run check:interactions` | Exit 0; 17/17 groups, Chromium 156 |
| `npm run check:interactions -- --webkit` | Exit 0; 17/17 groups, Linux WebKit 27.2, isolated launcher |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline` | Exit 0; 16/16 on final export, isolated Playwright module/browser path |
| Public-source/DOM comparison | 13 rendered post bodies per engine match captured text; source counter sets match public-page captures; all 15 permalinks return HTTP 200 during source checks |

The first interaction run stopped at an overly exact author text locator that included hidden new-tab text. The check now addresses the accessible heading; both complete suites pass. Initial missing browser/libraries were resolved with the isolated launcher. These setup/assertion issues are not shipped product defects. No new npm audit was performed for the unchanged lockfile; the previous round's audit result is not presented as a new check.

Final machine-readable evidence: [interaction-results.json](interaction-results.json), [accessibility-results.json](accessibility-results.json), [contrast.json](contrast.json), [taste-results.json](taste-results.json), [revision-evidence.json](revision-evidence.json).

## Rendered evidence and delivery

Final screenshots: [Chromium 390](screenshots/mobile-390.png), [WebKit 390](screenshots/webkit-mobile-390.png), [desktop](screenshots/desktop-1440.png), [About](screenshots/about-390.png), [keyboard focus](screenshots/keyboard-focus-390.png). Original/revised phone and desktop views, final 320 view, focused search and About states were inspected. Other responsive/enlarged-text/probe screenshots were generated in scratch, which is excluded from submission.

The complete export contains HTML, one generated JS/CSS pair, local font/license, five avatars, favicon, squad SVG and share PNG. Editable art remains in source. No dependency/cache directory, registry mirror, package archive or submodule was added. The existing ignore file is unchanged, its explicit path budget retained, and dist remains included. [submission-integrity.json](submission-integrity.json) records final bytes/hashes/path budgets; delivery is below 8,388,608 bytes.

Remaining limits: browser-local unsynced bookmarks; no exhaustive/live X source; no real iPhone/Safari, Firefox, native screen reader, native 200% zoom, translated/RTL page, forced-colors rendering, motion-panel replay or production unfurl test. Automated axe/probe results have bounded coverage. No requester value or unavailable service is fabricated.
