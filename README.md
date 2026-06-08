# Asatora (朝虎)

Single-origin matcha from 正福茶園, Shibushi, Kagoshima — a conversion-focused,
design-led brand site. Refined minimalism: warm paper field, a single matcha
accent, the wax-seal signature interaction, the obi vertical device, and faint
line-art atmosphere.

**Live:** https://www.asatora.shop

---

## What's in here

This repo is **two deliverables sharing one design system**:

- **Static marketing site** → live on **Vercel** (`index.html` + `assets/`),
  auto-deploys on every push to `main`.
- **Shopify Online Store 2.0 theme** → the commerce store
  (`sections/`, `snippets/`, `templates/`, `layout/`, `locales/`, `config/`),
  run/pushed with the Shopify CLI.

Both share `assets/` (design tokens, CSS, JS, comp images), so a token change
updates both.

**Stack:** Shopify custom theme · Bilingual EN + JP · Plausible · Klaviyo.

## Docs

- **[docs/STRUCTURE.md](docs/STRUCTURE.md)** — full folder map + which files belong to which target.
- **[docs/SETUP.md](docs/SETUP.md)** — local preview, Shopify CLI, deploy status, the `PLACEHOLDER` checklist, and acceptance-criteria status.

## Quickstart

```bash
# preview the static site
python3 -m http.server 8420        # → http://127.0.0.1:8420/

# work on the Shopify theme (needs Shopify CLI + a dev store)
shopify theme dev --store your-store.myshopify.com
```

Push to `main` → the static site auto-deploys to https://www.asatora.shop.
