# Feed sources and selection

Collected 31 October 2026 UTC from the public, logged-out X profiles of @surfcoderepeat, @taylor_, @damian_et and @imdradar. Each selected permalink was then fetched separately and returned HTTP 200. No private account, authentication or X API key was used. Direct retrieval succeeded although the web browsing service returned 403 for three of the same X links.

This is an editorial selection of 12 relevant posts from a limited public sample, not a claim to rank all IdentityMD posts on X. “Top tweets” sorts this collection by observed likes + reposts + replies; newest post breaks ties. “Latest” sorts by original UTC timestamp. Engagement is a dated snapshot, not a live statistic. Quotes are excerpts of no more than 25 words per post, identified in the interface, and lead to the full original. A middle excerpt may omit earlier text. Topic labels and search keywords are editorial. Claims inside posts are their authors’ claims and were not independently verified.

The initial sample and counts were acquired during this run on 31 October 2026. Permalink verification completed at approximately 17:11 UTC. These values intentionally stay fixed until the collection is updated.

| Rank | Original post | Date (UTC) | Topic | Likes | Reposts | Replies | Total |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 1 | [@surfcoderepeat](https://x.com/surfcoderepeat/status/2107939454396567581) | 2026-10-07 | Community | 400 | 93 | 35 | 528 |
| 2 | [@surfcoderepeat](https://x.com/surfcoderepeat/status/2102050129440133156) | 2026-09-21 | AI agents | 243 | 37 | 23 | 303 |
| 3 | [@taylor_](https://x.com/taylor_/status/2111926070052036690) | 2026-10-18 | Building | 153 | 18 | 26 | 197 |
| 4 | [@damian_et](https://x.com/damian_et/status/2109336654259642456) | 2026-10-11 | AI agents | 94 | 20 | 13 | 127 |
| 5 | [@taylor_](https://x.com/taylor_/status/2115516924948054326) | 2026-10-28 | Community | 79 | 13 | 11 | 103 |
| 6 | [@damian_et](https://x.com/damian_et/status/2108690626627703281) | 2026-10-09 | AI agents | 74 | 17 | 6 | 97 |
| 7 | [@taylor_](https://x.com/taylor_/status/2116290108060275184) | 2026-10-30 | AI agents | 73 | 11 | 10 | 94 |
| 8 | [@damian_et](https://x.com/damian_et/status/2115508430186348696) | 2026-10-28 | Community | 61 | 16 | 7 | 84 |
| 9 | [@imdradar](https://x.com/imdradar/status/2110765083311689890) | 2026-10-15 | Ecosystem | 56 | 7 | 7 | 70 |
| 10 | [@surfcoderepeat](https://x.com/surfcoderepeat/status/2116186409522667728) | 2026-10-30 | Building | 51 | 7 | 7 | 65 |
| 11 | [@imdradar](https://x.com/imdradar/status/2115509974621184454) | 2026-10-28 | Community | 33 | 6 | 5 | 44 |
| 12 | [@imdradar](https://x.com/imdradar/status/2114368282199224601) | 2026-10-25 | Ecosystem | 24 | 6 | 4 | 34 |

## Assets

- Avatars were obtained from each author’s `pbs.twimg.com` public profile image URL exposed in the primary X response, and bundled locally. They identify their respective accounts; they are not verification badges or an endorsement.
- `public/art/swamp-agents.svg` and `public/art/favicon.svg` are original illustrations created for this site. The Pepe-inspired artwork is site artwork, not media attached to any tweet.
- `src/artwork/social.svg` is the editable source for the local 1200×630 PNG share image.
- Manrope variable Latin WOFF2 was obtained from Google Fonts, `https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2`. Its OFL license is bundled at `public/fonts/OFL.txt` and in the export.

## Updating the collection

Edit `src/posts.ts`: retain the exact post ID and permalink, public author, UTC date, short excerpt, editorial topic, and observed counts. Update `SNAPSHOT_DATE` and this record together. Avoid implying that a limited sample is a complete ranking or that captured metrics are current. Rebuild and replace `dist/` after changes. The client uses no feed service or runtime API.
