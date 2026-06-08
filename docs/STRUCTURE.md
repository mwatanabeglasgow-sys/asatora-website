# Repo structure

This repo holds **two deliverables that share one design system**:

1. **Static marketing site** → deployed to **Vercel** at `www.asatora.shop`
   (auto-deploys on every push to `main`).
2. **Shopify Online Store 2.0 theme** → the eventual commerce store
   (run/pushed with the Shopify CLI; not hosted on Vercel).

They live in the same flat root on purpose: the Shopify CLI requires its folders
(`sections/`, `snippets/`, `templates/`, `layout/`, `locales/`, `config/`,
`assets/`) at the repository root, and Vercel serves `index.html` from the root.
`.vercelignore` hides the Shopify-only folders from the Vercel build.

```
asatora/
├─ index.html              ← Vercel static homepage (the deployed site)
├─ vercel.json             ← Vercel config (clean URLs, asset caching)
├─ .vercelignore           ← hides Shopify theme files + docs from the deploy
├─ README.md               ← repo landing page (concise)
│
├─ assets/                 ← SHARED by the static site AND the Shopify theme
│  ├─ tokens.css           ← design tokens — single source of truth (color/type/space/motion)
│  ├─ base.css             ← all components + states (Hallmark-stamped)
│  ├─ asatora.js           ← cart drawer, hero choreography, reveals, Klaviyo, analytics
│  └─ comp-*.png           ← AI comp imagery for layout testing (replace before launch)
│
│  ── Shopify theme (root-level, required by the Shopify CLI) ──
├─ layout/
│  └─ theme.liquid         ← document shell: fonts, grain, Plausible, schema.org, drawer
├─ sections/               ← hero, pillars, product-feature, provenance, ritual,
│                            shop-grid, testimonials, mountain-letter, main-product (PDP),
│                            main-collection, main-page, main-404, story,
│                            header, footer, announcement-bar, header/footer groups
├─ snippets/               ← seal, cart-drawer, email-letter, product-card, lineart, icon
├─ templates/              ← index · product · collection · cart · page · page.story
│                            · 404 · list-collections  (JSON + a couple of .liquid)
├─ locales/                ← en.default.json · ja.json   (bilingual EN/JP)
├─ config/                 ← settings_schema.json · settings_data.json
│
└─ docs/
   ├─ STRUCTURE.md         ← this file
   └─ SETUP.md             ← run/deploy instructions, placeholder checklist, status
```

## Which files belong to which target?

| Target | Files |
|---|---|
| **Vercel static site** | `index.html`, `vercel.json`, `assets/` |
| **Shopify theme** | `layout/`, `sections/`, `snippets/`, `templates/`, `locales/`, `config/`, `assets/` |
| **Shared** | everything in `assets/` (tokens, base CSS, JS, comps) |

> Because `assets/` is shared, a design-token change in `assets/tokens.css` or
> `assets/base.css` updates **both** the live Vercel site and the Shopify theme.

## Conventions

- **Tokens only.** Every color/space/type/motion value references a token in
  `assets/tokens.css`. No hardcoded values in component CSS.
- **Bilingual.** UI strings come from `locales/`; section-level copy is translated
  per-locale in the Shopify theme editor's language switcher.
- **One accent.** `--matcha` is reserved for primary CTAs + the wax seal.
  `--gold` is hairlines/wordmark only. No pure `#FFFFFF` surfaces.
