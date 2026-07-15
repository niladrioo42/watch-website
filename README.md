# Nexus Watch Studio

A premium, production-quality watch showcase site built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step.

## Project structure

```
nexus-watch-studio/
├── index.html        # Markup for every section + modal/panel templates
├── style.css          # Design tokens, layout, components, responsive rules
├── script.js          # Rendering, filtering, search, favorites, compare, settings
├── data.js            # Product catalog (single source of truth for watch data)
├── manifest.json       # PWA manifest (for PWABuilder → Android APK)
├── assets/
│   ├── images/         # (reserved for future real product photography)
│   ├── icons/           # favicon.svg + placeholders for PWA icons
│   └── fonts/            # (reserved — currently loads Google Fonts by CDN)
└── README.md
```

## Running it locally

No build step required. Either:
- Open `index.html` directly in a browser, or
- Serve the folder so relative fetches behave like production:
  ```
  npx serve nexus-watch-studio
  ```

## Design system

- **Palette**: obsidian background, brushed-steel surfaces, warm brass accent — evokes case materials rather than a generic brand gradient. Accent color is swappable at runtime from Settings (brass / steel / emerald / rosewood), each defined as a `[data-accent]` CSS override in `style.css`.
- **Type**: Fraunces (display/headings), Inter (body/UI), Space Mono (prices, specs, timestamps).
- **Signature element**: the hero features a live SVG watch face whose hands track the visitor's actual local time (`updateHeroClock()` in `script.js`), reinforcing "a watch you actually wear" rather than a static hero image.
- Dark mode is default; light mode and "auto" (follows OS) are available in Settings and persisted to `localStorage`.

## How product data works

Every watch card, rail, modal, and comparison table renders from a single object shape defined in `data.js` (see the `WATCH_SCHEMA` comment at the top of that file). Watch "photography" is a deterministic SVG dial generated from each product's `dial` color tokens (`renderWatchSVG()` in `script.js`) — this keeps the whole catalog lightweight and avoids broken image requests on slow mobile connections. Swap in real photography later by replacing `renderWatchSVG()` calls with `<img>` tags pointing at an `images` array per product; the rest of the render pipeline does not need to change.

## Extension points (future-ready by design)

- **Firebase / Supabase**: replace the body of `fetchCatalog()` in `script.js` with a real fetch/query. Every render function already consumes `State.catalog` as a plain array, so nothing else changes.
- **Image upload / Cloudinary**: add an `images: []` field to each product in `data.js` (or the future DB record) and update the modal gallery loop to render `<img>` instead of `renderWatchSVG()`.
- **Authentication**: favorites/compare currently persist per-browser via `localStorage` (`Store` helper in `script.js`). Swapping to per-account storage means replacing the `Store.get/set` calls with API calls — the call sites are already isolated to `toggleFavorite()` and `toggleCompare()`.
- **Admin panel**: because all product data lives in one array with a documented schema, an admin UI just needs to produce objects in that shape (via a form or CMS) and write them back to whatever `fetchCatalog()` is reading from at the time.
- **Cart/checkout**: the "Buy" button currently shows a toast placeholder (`data-action="buy"` in `script.js`) — wire it to a real cart/payment flow when ready.

## Deployment notes (Netlify / PWABuilder)

- The site is a static folder — drag-and-drop or connect the repo directly in Netlify, no build command needed.
- `manifest.json` and the SVG favicon are already in place for PWABuilder to package as an Android APK. Before shipping, replace `assets/icons/icon-192.png` and `icon-512.png` with real PNG exports (referenced in `manifest.json` but not yet generated).
- All interactive state (theme, accent, favorites, compare list) persists via `localStorage` with a safe try/catch wrapper (`Store` in `script.js`), so it degrades gracefully if storage is blocked (e.g. some in-app Android WebViews).

## Accessibility & performance notes

- Skip link, visible focus states, `aria-live` regions on toasts/newsletter status, and `aria-pressed`/`aria-expanded` on all toggles.
- Respects `prefers-reduced-motion`, plus an explicit in-app "Animation speed" setting (Full / Reduced / Off).
- Images are vector (inline SVG), so there is nothing to lazy-load in the current build; if real photography is added later, add `loading="lazy"` to those `<img>` tags.
- No external JS dependencies — only Google Fonts is loaded from a CDN.
