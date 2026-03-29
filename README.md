# Faculty profile site

Static faculty research site for **April Jiawei Zhang 張家維**, built with [Astro](https://astro.build/) and Tailwind CSS v4. Visitor-facing copy uses **British English** (`lang="en-GB"`).

**Live site:** [https://apriljzhang.com](https://apriljzhang.com) (custom domain on GitHub Pages).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Configure before publishing

1. **`astro.config.mjs`** — `site` is `https://apriljzhang.com` for canonical URLs and SEO.
2. **`public/CNAME`** — Contains `apriljzhang.com` so each deploy tells GitHub Pages which host to serve.
3. **`src/data/contact.ts`** — CityU / Gmail / Outlook. Optional env: `PUBLIC_CITYU_EMAIL`, `PUBLIC_OUTLOOK_EMAIL` (see `.env.example`).
4. **`public/images/profile.jpg`** — Headshot asset.

CV text, grants, and publications live in **`src/data/cv.ts`**. Research profile URLs are in **`src/data/profiles.ts`**.

## GitHub Pages + custom domain

Repository: **`Apriljzhang/academic-homepage`**.

1. **DNS (at your domain registrar)** for the **apex** `apriljzhang.com`, create **four A records** pointing to GitHub Pages:

   | Type | Name / Host | Value         |
   | ---- | ----------- | ------------- |
   | A    | `@`         | 185.199.108.153 |
   | A    | `@`         | 185.199.109.153 |
   | A    | `@`         | 185.199.110.153 |
   | A    | `@`         | 185.199.111.153 |

   Optional **www**: add a **CNAME** record: host `www` → target `Apriljzhang.github.io` (then in GitHub you can add `www.apriljzhang.com` as an alias if you want both).

2. **GitHub:** Repo **Settings → Pages → Custom domain** → enter **`apriljzhang.com`** and save. Wait for DNS check to pass, then enable **Enforce HTTPS**.

3. **Source:** **Settings → Pages → Build and deployment** → **Source: GitHub Actions**. Pushes to `main` run `.github/workflows/deploy.yml`.

Confirm the latest workflow run copied `CNAME` into the published `dist/` (it lives under `public/`, so it is included automatically).

If anything still opens at `https://apriljzhang.github.io/academic-homepage/`, that URL may redirect once the custom domain is active; bookmarks should use **https://apriljzhang.com**.

## Build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.
