# Asatora (朝虎) — Shopify Theme

Conversion-focused, design-led custom Online Store 2.0 theme for **Asatora** —
single-origin matcha from 正福茶園, Shibushi, Kagoshima.

Built per the brand brief: refined minimalism, warm paper field + a single matcha
accent, the wax-seal signature interaction, the obi vertical device, and faint
line-art atmosphere.

**Stack decisions (confirmed):** Shopify custom theme · Bilingual EN + JP ·
Plausible analytics · Klaviyo email.

---

## Run it locally

Requires the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) and a dev store.

```bash
# from this directory
shopify theme dev --store your-store.myshopify.com   # live-reload preview
shopify theme check                                   # lint (install Theme Check)
shopify theme push --unpublished                      # upload as a draft
```

No build step — assets are plain CSS/JS, fonts load from Google Fonts with
`display=swap`. Design tokens live in `assets/tokens.css` (single source of truth).

---

## 🧪 Comp images (for layout testing only)

`assets/comp-*.png` are AI-generated **comps** wired into the placeholder
fallbacks so the layout renders fully before real assets arrive
(`comp-hero`, `comp-tin`, `comp-bag`, `comp-garden`, `comp-ritual`, `comp-seal`).
Packaging is intentionally unbranded — these are NOT brand assets and must be
replaced before launch. Uploading a real Logo / Wax seal / product or section
image in the editor automatically overrides the matching comp.

## ⛔ Placeholders to replace (search the code for `PLACEHOLDER`)

These are the §2 items you haven't supplied yet. The theme runs with tasteful
fallbacks; swap each in via **Theme settings** or the named file.

| Item | Where | How |
|---|---|---|
| Logo (tiger + mountain roundel / wordmark) | Theme settings → Brand assets → *Logo* | upload SVG/PNG |
| Wax-seal mark (green, transparent) | Theme settings → *Wax seal* | upload PNG/SVG — drives the signature interaction |
| Line-art (mountain / pine / terrace) | Theme settings → *Line-art motif* | upload SVG/PNG (faint atmosphere + footer) |
| Product photography | Product admin + section image pickers | hi-res tin/bag on cream |
| Hero image | Homepage → Hero section | tin on cream |
| Final copy (hero, descriptions, tasting notes) | `locales/*.json` + section settings | edit strings / per-locale in editor |
| On-pack JP provenance string (正福茶園 / 鹿児島・志布志) | Homepage → Provenance → *JP text* | paste exact approved string |
| Pricing & inventory, Subscribe & Save % | Shopify admin (products + selling plans) | set ¥ price, qty, subscription discount |
| Plausible domain | Theme settings → Integrations | e.g. `asatora.com` |
| Klaviyo company + list IDs | Theme settings → Integrations | public company ID + Mountain Letter list ID |

Until Klaviyo IDs are set, the email form succeeds locally (logs a console warning)
so the UX is testable. Until a subscription selling plan exists, the PDP shows a
"coming soon" hint instead of the Subscribe & Save toggle.

---

## Structure

```
assets/      tokens.css (SSOT) · base.css · asatora.js
layout/      theme.liquid (fonts, grain, Plausible, schema.org, drawer)
sections/    hero, pillars, product-feature, provenance, ritual, shop-grid,
             testimonials, mountain-letter, main-product (PDP), main-collection,
             story, header, footer, announcement-bar, header/footer groups
snippets/    seal, cart-drawer, email-letter, product-card, lineart, icon
templates/   index · product · collection · cart · page · page.story · 404 · list-collections
locales/     en.default.json · ja.json (bilingual)
config/      settings_schema.json · settings_data.json
```

### Conventions
- **Tokens only.** Colors/space/type/motion reference `tokens.css`; no hardcoded values.
- **Bilingual.** UI strings come from `locales/`; section-level copy is translatable
  per-locale in the theme editor's language switcher.
- **One accent.** `--matcha` is reserved for primary CTAs + the seal. `--gold` is
  hairlines/wordmark only. No `#FFFFFF` surfaces.

---

## Acceptance criteria (§15) — status

**Conversion & content**
- ✅ One primary CTA color (`--matcha`); nav ≤ 4 items (capped in Liquid).
- ✅ Each homepage section = one idea, ≤ 2 lines body copy.
- ✅ Sticky mobile Add-to-Cart on PDP; slide-out AJAX cart (no full reload).
- ✅ Email capture fires `email_signup`; analytics events on add/remove/checkout.
- ✅ No "stone-milled" claim anywhere.
- ⚠️ Real logo / photos / seal — **flagged placeholders** until supplied.

**Craft & design**
- ✅ Fraunces / Shippori Mincho / Hanken Grotesk (no Inter/Roboto/Arial/system).
- ✅ Warm field + single matcha accent; gold hairlines only; no pure white.
- ✅ Obi vertical rail + faint line-art + paper grain.
- ✅ Orchestrated hero load with wax-seal "press"; `prefers-reduced-motion` honored.
- ✅ All component states (hover/focus/active/disabled/loading/empty/error).
- ✅ Editorial composition (asymmetry, full-bleed hero, obi overlap).

**Engineering**
- ✅ Tokens centralized; SKUs/sections data-driven and extensible.
- ✅ schema.org Product + Organization, OG/Twitter, canonical, semantic landmarks.
- ⚠️ Lighthouse/LCP/CLS — verify on the dev store with real images
  (hero uses `fetchpriority="high"`, responsive `srcset`, fonts `swap`).

---

## Analytics events (Plausible custom events)

`add_to_cart` · `remove_from_cart` · `view_cart` · `email_signup`
(+ `begin_checkout`/`purchase` fire from Shopify's native checkout — wire in the
Plausible/Shopify integration or a checkout pixel).
