# The Swamp design system

## Overview

The Swamp is an independent reader for public IdentityMD posts. The visual idea is a calm, dark green feed with a small squad of Pepe agents equipped with AI hardware. The illustration carries the character; the controls and post excerpts stay direct and readable. “The swamp has signal.” is the sole hero headline, followed by a plain description of the product.

The source of truth is `src/styles.css`, supported by `src/App.tsx` and `src/components/`. Runtime artwork and typography are bundled locally. This document records the implemented system after the review corrections, not a proposed redesign.

## Colors

The root uses a hex palette with primitive and semantic tokens. Components use semantic tokens for the shared page, surface, text, control, accent, and focus roles.

| Role token | Value / primitive | Use |
| --- | --- | --- |
| `--color-bg` | `--green-950: #0b130e` | Page background |
| `--color-surface` | `--green-925: #101b13` | Posts and form controls |
| `--color-surface-raised` | `--green-900: #132118` | About dialog |
| `--color-surface-hover` | `--green-850: #182b1d` | Neutral hover, selected context, topic tags |
| `--color-border` | `--green-800: #203723` | Structural rules and card borders |
| `--color-control-border` | `--green-700: #2e4732` | Input and secondary-button boundaries |
| `--color-text` | `--sage-100: #e8eee7` | Headings and post copy |
| `--color-text-muted` | `--sage-300: #a5b7a7` | Metadata, labels, supporting information |
| `--color-accent`, `--color-focus` | `--lime-400: #b3ed78` | Primary action, selected controls, focus perimeter |
| `--color-accent-hover` | `--lime-300: #c6f69b` | Primary-action hover |
| `--color-on-accent` | `--lime-950: #173017` | Text and icons on lime buttons |

Section-specific values remain in their CSS rules: the hero is `#15281b` with a `#2c422c` border and `#b6c5b3` supporting text; its caption has a solid `#15281b` backing and `#bdcfaf` text. The project panel uses `#192f1e`, border `#345133`, and `#bbccb2` text. Topic tags use `#b4c8ac`; post links use `#bfd0b7`. These are local treatments, not additional themes or statuses. The hero’s subtle radial background and mobile fade are decorative art treatments. SVG artwork has its own illustration palette.

Selected states pair color with an underline, filled bookmark, `aria-pressed`, or a changed heading. No status relies on green alone. The page intentionally has one dark theme.

Measured rendered solid pairs include body/page **16.00:1**, post copy/card **14.99:1**, metadata/card **8.36:1**, topic/tag **8.41:1**, primary action **10.40:1**, hero caption/backing **9.40:1**, and project copy/panel **8.45:1**. See `artifacts/contrast.json` and the validation limits for the automated probe’s art-overlap exception.

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

The root is 16px with line-height 1.6. Hero line-height is 1.07 (1.1 on mobile), post excerpts 1.7 (1.65 on mobile), and wrapped supporting copy 1.5–1.7. The hero uses `-.055em` tracking (`-.05em` on mobile); smaller headings use roughly `-.02em` to `-.035em`. Body copy keeps normal tracking. Headings balance their lines; descriptions use `text-wrap: pretty`. Post measure is capped at `68ch`.

Inputs and selects use 16px on mobile to avoid iOS input zoom. Counts use tabular numerals. Handles and long query strings can wrap; critical names, dates, and links are not ellipsized. Desktop excerpts preserve their original line breaks, while mobile collapses whitespace so the product and source action fit the first screen. The six-token scale remains the system even where only five sizes are visible in a given viewport.

## Layout

The spacing tokens are 4, 8, 12, 16, 20, 24, 32, 40, and 48px. Related content generally has 8–12px spacing; separate groups use 20–40px. Compact feed details include optical gaps of 5–7px.

The desktop `.page-shell` is at most 1280px including 48px inline padding. The header has its own 1400px maximum and 88px minimum height. `.content-grid` uses `minmax(0, 1fr) 300px` with a 32px gap. Controls precede the posts they change. The hero is a page-specific composition rather than a general card primitive.

| Breakpoint | Implemented adaptation |
| --- | --- |
| ≥1500px | Shell 1376px, header 1496px, sidebar 320px, grid gap 40px; hero minimum 326px |
| ≤1120px | 32px gutters, sidebar 272px, grid gap 24px; header About link hidden |
| ≤900px | Single content column; sidebar and central header navigation hidden; topics remain in the native select and About remains available from Snapshot and the footer |
| ≤580px | 20px gutters, 68px header minimum, 36px hero type, compact 218px-minimum hero, small overlaid illustration; saved posts remain a header utility |
| ≤360px | 16px gutters, slightly tighter post statistics and controls |

All grids allow their primary column to shrink. Headings, filters, toolbars, post context, and action rows wrap when enlarged text needs room. Topic widths use rem units, so the selected option remains usable with text enlargement. Artwork is clipped inside the hero’s rounded boundary; post text and controls remain in normal flow. There is no sticky chrome covering content.

Observed widths were 320, 390, 768, 1024, and 1440px in Chromium and WebKit. The guide’s 320/390/1440 probe also passed reflow and overlap checks. At 390×844 the first tweet and its source action are on the first screen. Browser-native zoom and a translated/RTL version were not tested; the interface currently ships in English only.

## Elevation & Depth

The interface is flat. Tonal surfaces and 1px borders separate controls, cards, and sections; no card combines a border with a shadow. Avatars use a 1px white outline at 10% opacity. The dialog is the sole overlay: its native top layer and `#030b07cc` blurred backdrop establish depth. Opening it locks background scrolling. The illustration’s own shading is part of the art, not UI elevation.

## Shapes

Shared radii are 8px for controls, 12px for cards, and 20px for the desktop hero (16px on mobile). The dialog is 16px; small tags and count labels use 5px. Avatars are circular. The frog favicon is an original rounded-square mark. No decorative nested-card system is used.

## Components

- **Header and navigation** (`src/App.tsx`): brand at the leading edge, Feed/About on desktop, Saved and an external X search at the trailing edge. `#feed` and `#saved` work on static hosts. The skip link focuses the content without changing a saved view.
- **Buttons and icons** (`src/components/Icon.tsx`, `.button`, `.icon-button`): one consistent SVG set with `currentColor`, 1.6px strokes, and hidden decorative semantics. Primary lime buttons, neutral bordered buttons, and compact icon actions share visible `:focus-visible` outlines. Hover changes are gated to hover-capable devices.
- **Feed controls** (`src/App.tsx`): visibly labeled search and native topic select, two sort buttons with `aria-pressed`, and a polite result count. Search includes excerpts, author/handle, topic, and editorial keywords. Empty results offer Clear filters. Changing a topic from a card or sidebar brings the filtered feed into view.
- **PostCard** (`src/components/PostCard.tsx`): takes a sourced `post`, its global engagement `rank`, `saved`, `onSave`, and `onTopic`. Author, handle, UTC date, short quote, topic, read-only observed statistics, save action, and original permalink appear in one stable format. Stats do not pretend to like or repost on X. The save state has a filled icon, accessible label, and `aria-pressed`.
- **Saved view** (`src/App.tsx`): validated IDs live in `localStorage`; corrupted values safely reset. A visible notice explains session-only saves when storage is denied. Removing a saved post moves focus to another saved action or the empty-state link. An empty saved collection explains how to fill it and links back to the feed.
- **Incremental feed** (`src/App.tsx`): initially shows six posts. Load more appends up to six and focuses the new content. Search/filter/sort resets the displayed count. The final state says the collection is complete and displays the capture date.
- **AboutDialog** (`src/components/AboutDialog.tsx`): native `<dialog>` driven by `open`/`onClose`. It explains the sample, ranking, source excerpts, and local storage. `showModal()` supplies modal semantics and inert background behavior; explicit Tab/Shift+Tab wrapping keeps focus inside. Escape, close button, and backdrop dismiss it, and focus returns to the invoking control.
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
