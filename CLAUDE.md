# adiatmaja.github.io — Personal Portfolio Website

Static single-page portfolio for Johannes Baptista Adiatmaja Pambudi, Data Scientist.
Live at: https://adiatmaja.github.io/

---

## Tech Stack

- Pure HTML/CSS/JS — no build step, no npm, no bundler
- **GSAP** (CDN) — animations (hero, scroll-triggered, transitions)
- **Google Fonts CDN** — Inter typeface
- **Devicon CDN** — skill/technology icons

---

## Quick Start

```bash
python -m http.server 8000
# Open http://localhost:8000
```

---

## Project Structure

```
adiatmaja.github.io/
├── index.html          # Main single-page portfolio — hero, nav, projects, contact
├── CV - Johannes Baptista Adiatmaja Pambudi.pdf   # Downloadable CV (linked from index.html)
├── pages/              # Individual project detail pages (one .html per project)
│   └── *.html
└── assets/
    ├── css/            # Stylesheets
    ├── js/             # JavaScript (GSAP animations, interactions)
    ├── icons/          # Icon files (e.g. n8n.svg)
    └── thumbnail.png   # Favicon + Open Graph / social share image
```

---

## Key Conventions

- **No build step** — edit HTML/CSS/JS directly, changes are instant
- **CDN dependencies** — GSAP, Google Fonts, Devicon loaded from CDN; no local copies
- **Single page** — all main content lives in `index.html`; `pages/` are standalone detail pages
- **Anchor links** — internal navigation uses `#section-id` anchors within `index.html`
- **CV** — the file is `CV - Johannes Baptista Adiatmaja Pambudi.pdf`; if renamed, update the hero link in `index.html` to match
- **Social/OG image** — `assets/thumbnail.png` is used as both the favicon and the Open Graph / Twitter share image

---

## Deployment

- **Host**: GitHub Pages — auto-deploys from `main` branch of `adiatmaja/adiatmaja.github.io` repo
- **Push to deploy**: `git push origin main` triggers deploy (no CI step needed)
- **Custom domain**: none — served at `https://adiatmaja.github.io/`
- **HTTPS**: provided automatically by GitHub Pages
