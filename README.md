# Faculty profile site

Static faculty research site for **April Jiawei Zhang 張家維**, built with [Astro](https://astro.build/) and Tailwind CSS v4. Visitor-facing copy uses **British English** (`lang="en-GB"`).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Configure before publishing

1. **`astro.config.mjs`** — `site` is `https://apriljzhang.github.io` and `base` is `/academic-homepage` for this repo. For a root user site (`USERNAME.github.io` repo), remove `base` and point `site` at `https://USERNAME.github.io`.
2. **`src/data/contact.ts`** — Replace the placeholder CityU and Outlook addresses with your real emails. Optionally set `PUBLIC_CITYU_EMAIL` and `PUBLIC_OUTLOOK_EMAIL` at build time (see `.env.example`).
3. **`public/images/profile.jpg`** — Replace if you update your headshot (source was copied from OneDrive-Personal).

CV text, grants, teaching, and publications live in **`src/data/cv.ts`**. Research profile URLs are in **`src/data/profiles.ts`**.

## Deploy on GitHub Pages (this repo)

Repository: **`Apriljzhang/academic-homepage`** (example remote: `git@github.com:Apriljzhang/academic-homepage.git`).

1. Push the `main` branch to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Let the workflow **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`) run on `main`.

Live URL: **https://apriljzhang.github.io/academic-homepage/**

For a **user site** at `https://USERNAME.github.io/` instead, use a repo named `USERNAME.github.io`, remove `base` from `astro.config.mjs`, and set `site` accordingly.

## Build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.
