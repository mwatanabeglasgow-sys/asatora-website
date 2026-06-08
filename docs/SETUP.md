# Setup, deploy & status

## The static site (Vercel)

Already live and wired:

- **Repo:** `mwatanabeglasgow-sys/asatora-website`
- **Vercel project:** `project-asatora` (team `nutroko`)
- **Production branch:** `main` → **auto-deploys on every push**
- **Domains:** `www.asatora.shop` (live); `asatora.shop` redirects to `www`

No build step — `index.html` + `assets/` are served as static files.
`vercel.json` sets clean URLs and long-cache headers for `/assets/*`.

### Preview the static site locally
```bash
python3 -m http.server 8420   # then open http://127.0.0.1:8420/
```

## The Shopify theme

Requires the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) and a dev store.

```bash
shopify theme dev   --store your-store.myshopify.com   # live-reload preview
shopify theme check                                    # lint (Theme Check)
shopify theme push  --unpublished                      # upload as a draft
```

Design tokens live in `assets/tokens.css` (single source of truth). Fonts load
from Google Fonts with `display=swap`.

---

## 🧪 Comp images (layout testing only)

`assets/comp-*.png` are AI-generated **comps** wired into placeholder fallbacks so
the layout renders fully before real assets arrive (`comp-hero`, `comp-tin`,
`comp-bag`, `comp-garden`, `comp-ritual`, `comp-seal`). Packaging is intentionally
unbranded — **not** brand assets; replace before launch. Uploading a real Logo /
Wax seal / product / section image in the Shopify editor overrides the matching comp.

## ⛔ Placeholders to replace (search the code for `PLACEHOLDER`)

| Item | Where | How |
|---|---|---|
| Logo (tiger + mountain roundel / wordmark) | Theme settings → Brand assets → *Logo* | upload SVG/PNG |
| Wax-seal mark (green, transparent) | Theme settings → *Wax seal* | upload PNG/SVG — drives the signature interaction |
| Line-art (mountain / pine / terrace) | Theme settings → *Line-art motif* | upload SVG/PNG |
| Product photography | Product admin + section image pickers | hi-res tin/bag on cream |
| Hero image | Homepage → Hero section | tin on cream |
| Final copy (hero, descriptions, tasting notes) | `locales/*.json` + section settings | edit strings / per-locale |
| On-pack JP provenance string (正福茶園 / 鹿児島・志布志) | Homepage → Provenance → *JP text* | paste exact approved string |
| Pricing & inventory, Subscribe & Save % | Shopify admin (products + selling plans) | set ¥ price, qty, discount |
| Plausible domain | Theme settings → Integrations | e.g. `asatora.shop` |
| Klaviyo company + list IDs | Theme settings → Integrations | public company ID + Mountain Letter list ID |

Until Klaviyo IDs are set, the email form succeeds locally (console warning) so the
UX is testable. Until a subscription selling plan exists, the PDP shows a
"coming soon" hint instead of the Subscribe & Save toggle.

---

## Acceptance criteria (brief §15) — status

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
- ✅ Hallmark mobile-safety gates 61/62/63 (see stamp atop `assets/base.css`).

**Engineering**
- ✅ Tokens centralized; SKUs/sections data-driven and extensible.
- ✅ schema.org Product + Organization, OG/Twitter, canonical, semantic landmarks.
- ⚠️ Lighthouse/LCP/CLS — verify with real images (hero uses `fetchpriority="high"`,
  responsive `srcset`, fonts `swap`).

---

## Analytics events (Plausible custom events)

`add_to_cart` · `remove_from_cart` · `view_cart` · `begin_checkout` · `email_signup`
(`purchase` fires from Shopify's native checkout — wire via the Plausible/Shopify
integration or a checkout pixel).
