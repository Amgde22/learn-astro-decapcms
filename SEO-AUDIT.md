# On-Page SEO Audit — Info PC SBA (www.infopc-sba.com)

**Goal:** rank higher in **Google Maps** (the local 3‑pack) for searches like
« réparation PC Sidi Bel Abbès », « محل إصلاح الكمبيوتر سيدي بلعباس », « magasin informatique SBA ».

**Audit date:** 2026‑09‑05 · **Scope:** on‑page / local‑SEO only. Performance, refactors and design were intentionally left untouched.

---

## 1. The business (identified from the codebase + its live listings)

| Field | Value (source of truth: the Google Business Profile listing) |
|---|---|
| Name | **INFO PC SBA** |
| Category | Computer support and services |
| Rating | 4.7 ★ |
| Address | N 50c Cité 345 Lgt, Al‑Wiam, Sidi Jilali, **Sidi Bel Abbès**, Algeria |
| Plus code | 696F+V7 Sidi Bel Abbès · **Coordinates 35.212359, −0.62672** |
| Phone | +213 770 66 24 25 (2nd line: 0560 86 33 70) |
| Website (site code) | www.infopc-sba.com · bilingual **Arabic (default) + French** |
| Services | PC repair (free diagnosis), system optimization, IT consulting, hardware & spare‑parts sales (incl. rare laptop parts — the shop's stated differentiator) |

The site is an Astro static build deployed on Netlify, with Decap CMS managing the product catalog (`/admin`).

---

## 2. ⚠️ The #1 lever is *outside* the website: the Google Business Profile

Google Maps ranking ≈ relevance + distance + prominence. The website feeds **relevance**; these GBP issues cap everything else the site can do:

1. **The listing appears unclaimed.** Google shows "Claim this business" on the listing (place ID `5899680543034959143`). → **Claim and verify it in Google Business Profile.** Until then, no hours/posts/insights can be managed and competitors' edits can corrupt the listing.
2. **The GBP "Website" field points to the old domain `infopc.netlify.app`, not `https://www.infopc-sba.com`.** This splits the entity's signals between two URLs and leaks trust from the custom domain. → Update it immediately after claiming.
3. **Hours conflict between sources:** GBP shows *Saturday 8:30 AM–8 PM*; the shop's newer landing page says *Sam–Jeu 9h–20h*. The website previously published **no hours at all**. This audit added hours to the site (see §3‑B4) as **Sa–Th 08:30–20:00** (editable in `src/data/client.json` → `openingHours`). → Confirm the real hours and make GBP, the site and all citations identical.
4. **Category & services:** keep primary category "Computer support and services"; add secondary ones the shop truly matches (*Computer store, Computer repair service, Computer accessories store*) and fill GBP services ("réparation PC portable", "vente de pièces détachées", "upgrade RAM/SSD"…).
5. **Reviews:** 4.7 ★ is a strong prominence asset — keep collecting (the WhatsApp/`tel:` CTAs on the site make follow‑up easy) and reply to reviews in Arabic/French.
6. **Add real photos** (storefront, interior, workshop) to GBP and use at least one on the website's home page later — it strengthens entity matching between the site and the listing.

---

## 3. On‑page findings

Severity: 🔴 hurts Maps/local visibility · 🟠 weakens local relevance · 🟡 hygiene.

### A. Findings that were **fixed in this branch**

| # | Sev | Finding (evidence) | Fix applied |
|---|---|---|---|
| A1 | 🔴 | **`robots.txt` declared the sitemap on the old domain:** `Sitemap: https://infopc.netlify.app//sitemap-index.xml` (double slash too). Search Console / Googlebot were pointed at a stale site. | → `Sitemap: https://www.infopc-sba.com/sitemap-index.xml` (`public/robots.txt`) |
| A2 | 🔴 | **Structured data described the wrong business.** JSON‑LD `"name": "Votre Magasin de PC"` (a placeholder!), no `telephone`, no street address, no `geo`, no `openingHours`, no `url`, no `hasMap`, an invalid property `uniqueSellingProposition`, and the block sat after `</html>`. Google could not confidently connect the site to the GBP listing. | Replaced with a complete `ComputerStore + RepairShop` entity in `<head>`: name **Info PC SBA** (= GBP), full street address, `geo 35.212359, −0.62672`, plus‑code‑consistent address, `telephone +213770662425` (E.164), `hasMap` → the listing's maps link, `openingHoursSpecification`, `priceRange DZD`, `areaServed`, `sameAs` → the shop's Facebook page, locale‑aware `description` and offers (repair service + accessories). **`@id` anchor for future `Department`/review markup.** (`src/layouts/BaseLayout.astro`, data in `src/data/client.json`) |
| A3 | 🔴 | **Title tags wasted the strongest local signal.** FR home: `Page d'accueil \| Info Pc Sba` — zero keywords. AR home: `الصفحة الرئيسية \| … \| Sidi Bel Abbés,` — generic + trailing comma + empty state. The FR home *never* got the city because the template checked `pathname === "/"` (FR home is `/fr/`). Titles also contained raw newlines/spaces. | Single‑line template `{title} \| {client.name}`. Locale titles are now keyword + city: FR `Magasin informatique & réparation PC à Sidi Bel Abbès`, AR `محل كمبيوتر وإصلاح الحاسوب في سيدي بلعباس`; products pages: `Matériel informatique à vendre à Sidi Bel Abbès` / `بيع أجهزة وقطع غيار الكمبيوتر في سيدي بلعباس`. (`BaseLayout.astro`, `src/locales/{fr,ar}/common.json`) |
| A4 | 🔴 | **NAP inconsistencies with the GBP listing.** Site city spelled `Sidi Bel Abbés` (acute) vs GBP `Sidi Bel Abbès`; brand `Info Pc Sba` vs GBP `INFO PC SBA`; phone shown unformatted `0770662425` vs GBP `+213 770 66 24 25`. Google cross‑checks these to merge the website with the listing. | `client.json`: name → `Info PC SBA`, city → `Sidi Bel Abbès` (footer + titles update automatically), phone display grouped `0770 66 24 25`, added `phoneE164 +213770662425` (used by schema; FAQ already used it). |
| A5 | 🟠 | **`og:image` was a relative URL** (`assets/images/...`) — broken on every share; no `og:site_name`, no `og:locale`. | Absolute image URL, `og:site_name Info PC SBA`, `og:locale ar_DZ/fr_FR` + `og:locale:alternate`. |
| A6 | 🟠 | **Heading hierarchy: the logo was an `<h1>` on every page (header *and* footer), the home page had 3+ H1s, and the real H1 carried no title semantics.** | Logo → `<span>` (visually identical; explicit CSS preserves size/color). Home now has **one** H1 (the localised hero line *"Réparation, vente et conseils au cœur de Sidi Bel Abbès"*), the products grid heading is `h2` at home and `h1` on `/Produits` (`Products.vue` uses `isSection`). (`Header.astro`, `Footer.astro`, `Products.vue`) |
| A7 | 🟠 | **Internal links pointed to a different case than the real route** (`/produits/` in nav/footer/home CTA vs actual `/Produits/` — Netlify case‑corrects with a redirect hop), and **nav/footer links were not locale‑prefixed** (French pages linked into the Arabic site and vice‑versa). | `navData.json` → `/Produits/`; home CTA → `getLocalePath("/Produits/")`; header & footer nav wrapped in `getLocalePath()`. |
| A8 | 🟡 | AR meta description claimed **"+20 عامًا"** while FR + schema said **17 years** — inconsistent entity facts. | Aligned AR to **17+** (`src/locales/ar/common.json`). **→ Owner: confirm the real figure and use it everywhere.** |
| A9 | 🟡 | `site.webmanifest` had **empty `name`/`short_name`** and icon paths pointing to `/android-chrome-*.png` (files live in `/assets/favicons/`) — broken branded metadata. | Names set to `Info PC SBA`, icon paths fixed. |
| A10 | 🟡 | Empty `<meta name="keywords">` (dead weight, unused by Google); hero background image had meaningless `alt="Cover picture"` while already `aria-hidden`. | Removed the keywords tag; decorative image `alt=""`. |

**Build output after fixes (verified):**

```text
/              → « محل كمبيوتر وإصلاح الحاسوب في سيدي بلعباس | Info PC SBA »   · 1 H1 · JSON-LD in <head>
/fr/           → « Magasin informatique & réparation PC à Sidi Bel Abbès | Info PC SBA » · 1 H1
/Produits/     → « بيع أجهزة وقطع غيار الكمبيوتر في سيدي بلعباس | Info PC SBA »
/fr/Produits/  → « Matériel informatique à vendre à Sidi Bel Abbès | Info PC SBA »
JSON-LD: name "Info PC SBA" · tel +213770662425 · geo 35.212359,−0.62672 · 6 opening days 08:30–20:00 · hasMap ✓
```

### B. Reviewed and **deliberately not changed** (scope discipline)

| Item | Why left alone |
|---|---|
| Product grid is rendered **client‑side only** (`client:only="vue"`), so product names/prices are absent from server HTML (they exist in Astro's island‑props JSON and after Google renders JS). Converting to SSR would require guarding `window`/`document` access in `Products.vue`/`useT.js`/`Slider.vue` and introduces hydration risk. | Not a direct Maps ranking factor; Google does render the content. **Recommended future improvement**, not an emergency. |
| In‑page `hreflang` uses `ar`/`fr` (bare codes, package‑generated) while the sitemap uses `ar‑DZ`/`fr‑FR`, and package alternates omit the trailing slash (`/Produits` vs canonical `/Produits/`). Netlify normalises both. | Cosmetic inconsistency; both resolve correctly. Changing it means forking the i18n package component for no measurable Maps gain. |
| No `FAQPage` schema | Google no longer serves FAQ rich results for ordinary business sites (since Aug 2023) and it is not a local‑pack factor. The visible FAQ text (already city/keyword‑rich) does the work. |
| Sitemap config (`changefreq`, `priority`, i18n alternates) | Correct and complete for 4 content URLs; `/admin` properly excluded + disallowed. |
| Meta Pixel, analytics, fonts, CSS/JS assets | Out of scope (performance/marketing, not Maps on‑page). |

---

## 4. Action plan, in order

**Before/with deploy**
1. Validate the structured data on one AR + one FR URL: <https://search.google.com/test/rich-results> and <https://validator.schema.org>.
2. Search Console: add property `https://www.infopc-sba.com`, submit `sitemap-index.xml`, request indexing of `/` and `/fr/`.

**Google Business Profile (the actual Maps ranking work)**
3. Claim & verify the listing (see §2‑1) and set the website field to `https://www.infopc-sba.com`.
4. Reconcile hours (GBP vs `client.json` `openingHours`) — pick the truth, use it everywhere.
5. Add secondary categories + services, photos, and a description using: réparation PC/ordinateur portable, pièces détachées, accessoires, Sidi Bel Abbès / سيدي بلعباس.
6. Start a steady review cadence (QR code at the counter → WhatsApp follow‑up works well in DZ) and reply to each review.

**Ongoing (cheap, high‑yield on‑page additions once the above is done)**
7. Put a short "Notre magasin à Sidi Bel Abbès" block (address, hours, embedded map) + real storefront photo on the home page — currently the strongest local content lives only in the FAQ.
8. Later: city/area content pages or a blog (*« où réparer son PC à Sidi Bel Abbès »*) to grow relevance beyond the home page.

---

## 5. Files changed in this audit

| File | Change |
|---|---|
| `public/robots.txt` | Sitemap URL → production domain |
| `src/data/client.json` | NAP aligned to GBP (name, city accent, grouped phone, E.164), added geo, plus code, opening hours, Facebook page |
| `src/layouts/BaseLayout.astro` | Complete LocalBusiness JSON‑LD in `<head>` (locale‑aware), fixed title template, absolute OG tags + `og:site_name`/`og:locale`, removed empty keywords tag |
| `src/locales/fr/common.json`, `src/locales/ar/common.json` | Keyword + city titles for home & products; AR years aligned (20 → 17+) |
| `src/data/navData.json`, `src/routes/index.astro` | Route casing `/Produits/`, locale‑prefixed CTA |
| `src/components/Header.astro`, `src/components/Footer.astro` | Logo `h1` → styled `span`, brand text `INFO PC SBA`, locale‑aware nav links |
| `src/components/Products.vue` | Grid heading: `h1` on `/Produits`, `h2` on home |
| `src/components/Hero.astro` | Decorative hero image `alt=""` |
| `public/assets/favicons/site.webmanifest` | Real app names + working icon paths |
| `astro.config.mjs` | Dev‑server only: `server.allowedHosts` (for proxied previews; no effect on the Netlify build) |
