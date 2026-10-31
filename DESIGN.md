# The Swamp design system

## Overview

The Swamp is a reader for public IdentityMD posts. The visual idea is a calm, dark green feed with a small squad of Pepe agents equipped with AI hardware. The illustration carries the character; the controls and full post text stay direct and readable. “The swamp has signal.” is the sole hero headline, followed by a plain description of the product.

The source of truth is `src/styles.css`, supported by `src/App.tsx` and `src/components/`. Runtime artwork and typography are bundled locally. This document records the implemented system after the review corrections, not a proposed redesign.

## Colors

The root uses a hex palette with primitive and semantic tokens. Components use semantic tokens for the shared page, surface, text, control, accent, and focus roles.

| Role token | Value / primitive | Use |
| --- | --- | --- |
| `--color-bg` | `--green-950: #0f2116` | Page background |
| `--color-surface` | `--green-925: #14291b` | Posts and form controls |
| `--color-surface-raised` | `--green-900: #183020` | About dialog |
| `--color-surface-hover` | `--green-850: #1e3826` | Neutral hover, selected context, topic tags |
| `--color-border` | `--green-800: #2a4a30` | Structural rules and card borders |
| `--color-control-border` | `--green-700: #3a5a3e` | Input and secondary-button boundaries |
| `--color-text` | `--sage-100: #e8eee7` | Headings and post copy |
| `--color-text-muted` | `--sage-300: #a5b7a7` | Metadata, labels, supporting information |
| `--color-accent`, `--color-focus` | `--lime-400: #b3ed78` | Primary action, selected controls, focus perimeter |
| `--color-accent-hover` | `--lime-300: #c6f69b` | Primary-action hover |
| `--color-on-accent` | `--lime-950: #173017` | Text and icons on lime buttons |

Section-specific values remain in their CSS rules: the hero is `#15281b` with a `#2c422c` border and `#b6c5b3` supporting text. The project panel uses `#192f1e`, border `#345133`, and `#bbccb2` text. Topic tags use `#b4c8ac`; post links use `#bfd0b7`. These are local treatments, not additional themes or statuses. The hero retains its subtle radial background. The illustration is fully opaque at every width, with no mobile mask or caption over the characters. SVG artwork has its own illustration palette.

Selected states pair color with an underline, filled bookmark, `aria-pressed`, or a changed heading. No status relies on green alone. The page intentionally has one dark theme.

Measured rendered solid pairs in both Chromium and WebKit include body/page **14.26:1**, post copy/card **13.07:1**, metadata/card **7.29:1**, topic/tag **7.16:1**, primary action **10.40:1**, select/card **13.07:1**, and project copy/panel **8.45:1**. See `artifacts/contrast.json`. These measurements resolve solid backgrounds; they do not certify every pixel of the decorative illustration or radial hero background.

## Typography

The single family is **Manrope**, with `Arial, sans-serif` fallbacks. `public/fonts/manrope-latin.woff2` is a local variable font declared for weights 400–700. The interface actually uses **400, 500, and 700**. Its SIL OFL notice is bundled next to the file. The Latin subset includes the names used in the feed.

| Token | Default size | Role |
| --- | --- | --- |
| `--text-caption` | 13px / `.8125rem` | Metadata, counts, compact labels |
| `--text-small` | 14px / `.875rem` | Buttons, supporting UI |
| `--text-body` | 16px / `1rem` | Tweets and body text |
| `--text-heading` | 20px / `1.25rem` | Feed heading and brand |
| `--text-large` | 32px / `2rem` | Dialog headline |
| `--text-display` | 52px / `3.25rem` | Hero; 36px / `2.25rem` at ≤580px |

The root is 16px with line-height 1.6. Hero line-height is 1.07 (1.1 on mobile), post text 1.7 (1.65 on mobile), and wrapped supporting copy 1.5–1.7. The hero uses `-.055em` tracking (`-.05em` on mobile); smaller headings use roughly `-.02em` to `-.035em`. Body copy keeps normal tracking. Headings balance their lines; descriptions use `text-wrap: pretty`. Post measure is capped at `68ch`.

Inputs and selects use 16px on mobile to avoid iOS input zoom. Counts use tabular numerals. Handles and long query strings can wrap; critical names, dates, and links are not ellipsized. Post text preserves the author’s paragraph breaks at every width through `white-space: pre-line`. Complete posts grow vertically; the beginning of the first tweet stays on the first phone screen. The six-token scale remains the system even where only five sizes are visible in a given viewport.

## Layout

The spacing tokens are 4, 8, 12, 16, 20, 24, 32, 40, and 48px. Related content generally has 8–12px spacing; separate groups use 20–40px. Compact feed details include optical gaps of 5–7px.

The desktop `.page-shell` is at most 1280px including 48px inline padding. The header has its own 1400px maximum and 88px minimum height. `.content-grid` uses `minmax(0, 1fr) 300px` with a 32px gap. Controls precede the posts they change. The hero is a page-specific composition rather than a general card primitive.

| Breakpoint | Implemented adaptation |
| --- | --- |
| ≥1500px | Shell 1376px, header 1496px, sidebar 320px, grid gap 40px; hero minimum 326px |
| ≤1120px | 32px gutters, sidebar 272px, grid gap 24px; header About link hidden |
| ≤900px | Single content column; the sidebar stacks after the feed, keeping people, the project explanation/link and collection note available. Only the duplicate topic list and central header navigation hide; topics remain in the native select, and About is available from the visible count-date button and footer |
| ≤580px | 20px gutters, 68px header minimum, 36px hero type, compact 218px-minimum hero, fully opaque illustration at 58% width, maximum 180px high, with an 18ch description measure that keeps text clear of the characters; saved posts remain a header utility |
| ≤360px | 16px gutters, slightly tighter post statistics and controls |

All grids allow their primary column to shrink. Headings, filters, toolbars, post context, and action rows wrap when enlarged text needs room. Topic widths use rem units, so the selected option remains usable with text enlargement. Artwork is clipped inside the hero’s rounded boundary; post text and controls remain in normal flow. There is no sticky chrome covering content.

Observed widths were 320, 390, 768, 1024, and 1440px in Chromium and WebKit. The guide’s 320/390/1440 probe also passed reflow and overlap checks. At 390×844 the sample description, count date, Explore the feed action, search, sorting, rank and start of the first tweet are on the first screen. The full tweet and its source link continue below the fold. Browser-native zoom and a translated/RTL version were not tested; the interface currently ships in English only.

## Elevation & Depth

The interface is flat. Tonal surfaces and 1px borders separate controls, cards, and sections; no card combines a border with a shadow. Avatars use a 1px white outline at 10% opacity. The dialog is the sole overlay: its native top layer and `#030b07cc` blurred backdrop establish depth. Opening it locks background scrolling. The illustration’s own shading is part of the art, not UI elevation.

## Shapes

Shared radii are 8px for controls, 12px for cards, and 20px for the desktop hero (16px on mobile). The dialog is 16px; small tags and count labels use 5px. Avatars are circular. The frog favicon is an original rounded-square mark. No decorative nested-card system is used.

## Components

- **Header and navigation** (`src/App.tsx`): brand at the leading edge, Feed/About on desktop, Saved and an external X search at the trailing edge. `#feed` and `#saved` work on static hosts. The skip link focuses the content without changing a saved view.
- **Buttons and icons** (`src/components/Icon.tsx`, `.button`, `.icon-button`): one consistent SVG set with `currentColor`, 1.6px strokes, and hidden decorative semantics. Primary lime buttons, neutral bordered buttons, and compact icon actions share visible `:focus-visible` outlines. Hover changes are gated to hover-capable devices.
- **Feed controls** (`src/App.tsx`): visibly labeled search and native topic select (custom chevron and `appearance: none` preserve native selection behavior), two sort buttons with `aria-pressed`, and a polite result count. Search includes complete post text, author/handle, topic, and editorial keywords. Empty results offer Clear filters. Search and select share 48px heights on phones. The 8.125rem topic field fits all options; a mobile search basis of 8.5rem keeps the row together at 320px. At 200% text enlargement the controls wrap. Feed anchors preserve filters and the loaded count when they only scroll within the feed; switching between Feed and Saved resets filters. Changing a topic from a card or sidebar brings the filtered feed into view.
- **PostCard** (`src/components/PostCard.tsx`): takes a sourced `post`, its global engagement `rank`, `saved`, `onSave`, and `onTopic`. Author, handle, UTC date, complete available post text (the existing `excerpt` data field), topic, read-only observed statistics, save action, and original permalink appear in one stable format. Global collection ranks remain visible on phones, including while sorted by latest. Article names include author and UTC date; engagement statistics form a named accessible group. Stats do not pretend to like or repost on X. The save state has a filled icon, accessible label, and `aria-pressed`.
- **Saved view** (`src/App.tsx`): validated IDs live in `localStorage`; corrupted values safely reset. A visible notice explains session-only saves when storage is denied. Removing a saved post moves focus to another saved action or the empty-state link. An empty saved collection explains how to fill it and links back to the feed.
- **Incremental feed** (`src/App.tsx`): initially shows six of 13 posts. Load more appends up to six, then the remaining one, and focuses the new content. Search/filter/sort resets the displayed count. The final state says the collection is complete and displays the capture date.
- **AboutDialog** (`src/components/AboutDialog.tsx`): native `<dialog>` driven by `open`/`onClose`. It explains the sample, ranking, omitted short links/media, and local storage. `showModal()` supplies modal semantics and inert background behavior; explicit Tab/Shift+Tab wrapping keeps focus inside. Escape, close button, and backdrop dismiss it, and focus returns to the invoking control.
- **Empty and error patterns** (`src/App.tsx`, `.empty-state`, `.storage-notice`): plain explanations and a next action. There is no artificial loading state because the feed is compiled into the export. Save announcements and result counts use stable polite live regions.

Only small color/background/border/press transitions are used: 150ms with `cubic-bezier(.2, 0, 0, 1)`. Press scale is `.96`. Motion is enabled only under `prefers-reduced-motion: no-preference`; there is no entrance, ticker, autoplay, or endless animation. Forced-colors focus uses the system Highlight color.

## Do’s and Don’ts

- Start with the page shell, existing spacing steps, and semantic role tokens. Keep custom illustration colors inside the artwork or the existing hero treatment.
- Keep one filled primary action in a view; use neutral controls for filters and utilities.
- Keep full names and source destinations reachable. Use wrapping rather than shrinking or clipping content to fit.
- Keep counts tied to the dated dataset. Update the provenance and capture date together with the source and export.
- Keep bookmarks explicitly local. Do not imply X account sync, live global rankings, verified authors, or a new social action.
- Reuse the font, type scale, icon set, and card rhythm. Additional fonts, tracked capital labels, moving tickers, and decorative nested panels conflict with this implementation.

Review evidence, fixes, screenshots, and unperformed checks are recorded in `artifacts/validation.md`. Guidance attribution is preserved in `THIRD_PARTY_NOTICES.md`.
