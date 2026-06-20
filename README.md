# Hành Trình Việt — *A Journey Begins Before You Travel*

A premium, emotion-led **lead-generation landing experience** for a Vietnamese
domestic travel agency. It is *not* a booking engine — there is no cart, login,
payment or chatbot. Every section is a chapter in the ritual of *preparing for a
journey*: opening a passport, collecting stamps, unfolding a map, filling in an
arrival card. The single goal is trust → a consultation lead.

> Built to an Awwwards bar while staying practical for a real business.

---

## ✦ Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | **Next.js 15** (App Router, RSC)                   |
| Language       | **TypeScript** (strict)                            |
| Styling        | **Tailwind CSS v4** (CSS-first `@theme`)           |
| Motion         | **GSAP + ScrollTrigger**, **Motion** (Framer), **Lenis** |
| Icons          | **lucide-react**                                   |
| Forms          | **react-hook-form** + **Zod**                      |
| Images         | **next/image** (AVIF/WebP)                         |
| Lead storage   | **Google Sheets** via Apps Script Web App          |
| Deploy         | **Vercel**                                         |

---

## ✦ Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in contact + webhook values
pnpm dev                     # http://localhost:3000
```

Build & run production:

```bash
pnpm build && pnpm start
```

The site works fully without any env vars — leads are validated and logged to
the server console (`stored: false`) until you wire up the sheet.

---

## ✦ Connecting the consultation form to Google Sheets

1. Create a Google Sheet with a tab named **`Leads`**.
2. **Extensions → Apps Script**, paste [`scripts/google-apps-script.js`](scripts/google-apps-script.js).
3. Set a random `SECRET`, then **Deploy → Web app** (*Execute as: Me*, *Access: Anyone*).
4. Put the values in `.env.local` / Vercel:

   ```env
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   LEAD_WEBHOOK_SECRET=<same string as SECRET>
   NEXT_PUBLIC_ZALO_URL=https://zalo.me/0900000000
   NEXT_PUBLIC_MESSENGER_URL=https://m.me/your-page
   NEXT_PUBLIC_PHONE=0900000000
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

On submit the API route validates with the **same Zod schema** as the client,
forwards to the sheet, and the UI plays a *passport-approved* stamp before
handing the visitor off to **Zalo** or **Messenger**.

---

## ✦ Architecture

```
src/
├─ app/
│  ├─ layout.tsx          # fonts, SEO metadata, providers, chrome
│  ├─ page.tsx            # section composition (below-fold = code-split)
│  ├─ globals.css         # design system (@theme), textures, keyframes
│  ├─ sitemap.ts · robots.ts
│  └─ api/lead/route.ts   # validate → Google Sheets
├─ components/
│  ├─ layout/             # Navbar, Footer
│  ├─ providers/          # SmoothScroll (Lenis)
│  ├─ fx/                 # LoadingScreen, GrainOverlay, CompassCursor
│  ├─ sections/           # the 8 story chapters
│  ├─ ui/                 # Reveal, Stamp, StampButton, BoardingPass, …
│  └─ seo/                # JsonLd (TravelAgency schema)
├─ hooks/                 # useReducedMotion
└─ lib/                   # site config, content data, gsap, validation, utils
```

**Server vs Client.** Layout, page, static sections (`SectionHeading`, `Footer`,
`JsonLd`) are **Server Components**. Only animation/stateful pieces opt into
`"use client"`. Heavy below-the-fold sections are `next/dynamic` code-split.

---

## ✦ The 8 chapters & their travel metaphor

| # | Section            | Metaphor / interaction |
|---|--------------------|------------------------|
| 1 | **Hero**           | Full-bleed cinematic landscape, oversized type with line mask-reveal + ken-burns parallax |
| – | **Manifesto**      | Full-bleed image with an oversized serif statement that wipes in |
| 2 | **Brand Story**    | Travel journal; each milestone is a dated visa stamp |
| 3 | **Why Choose Us**  | Four "confirmed" visa stamps + a boarding-gate stats strip |
| 4 | **Founder**        | A *Traveler Identity Page* (passport ID spread + MRZ) |
| 5 | **Tour Categories**| Boarding-pass class stubs in a **pinned horizontal scroll** |
| 6 | **Featured Tours** | Boarding passes that lift on hover, unfold into a detail ticket |
| 7 | **Destinations**   | Foldable Vietnam map; hover a pin → animated stamp + preview |
| 8 | **Contact CTA**    | An *Arrival Card*; submit → passport approved → Zalo/Messenger |

---

## ✦ Motion architecture — one job per library

Every animation library has a **single, enforced responsibility**. Nothing
overlaps, so the motion reads as intentional storytelling rather than effects.

| Library | Owns | Examples in this build |
| ------- | ---- | ---------------------- |
| **Lenis** | *All* scrolling | Inertia smooth-scroll driven by the **GSAP ticker** (one RAF clock), `syncTouch` on mobile, publishes live `--scroll-vel` for velocity-based motion. Native scroll is fully replaced. |
| **GSAP + ScrollTrigger** (via `@gsap/react` `useGSAP`) | Cinematic, scroll-driven story | Hero passport-open timeline (pin + scrub), split-text **mask reveals**, journal spine **path-draw**, Founder portrait **clip-path reveal** + MRZ typewriter, **pinned horizontal scroll** for tour classes, **MotionPath airplane** flying the Vietnam route, SVG route **draw-on**, parallax depth. |
| **Motion (Framer)** | UI micro-interactions only | Navbar + mobile menu, hover lifts, button stamp-tap, boarding-pass `layoutId` modal, map pin tooltips/rings, polaroid hover, approval stamp, loading curtain. *Never* used for long timelines. |
| **Parallax** (GSAP) | Depth on scroll | Reusable `<Parallax>` wrapper + ticket-photo drift, ghost-word watermarks, and founder/polaroid depth layers — all scrubbed to Lenis. |

**By the numbers:** 15+ GSAP tweens · 15+ ScrollTriggers (hero pin, split-text
reveals, story spine, founder, horizontal tour scroll, tour fan-in, map
unfold/route/plane/pins, polaroids, CTA card) · multiple parallax layers ·
20+ Motion interactions · Lenis on every scroll.

### Accessibility & graceful degradation
- `prefers-reduced-motion` disables Lenis, the compass cursor, and **all** GSAP
  choreography — content renders in its final state, no jank.
- The loading curtain is mounted client-only (gated), so it can never cause a
  hydration mismatch; ScrollTrigger re-`refresh()`es after fonts/images/lazy
  sections settle so nothing is left stuck off-screen.
- Split-text keeps the real string in the DOM (`aria-label` + tokens) for SEO/AT.
- Semantic landmarks, skip link, focus-visible rings, labelled controls, honeypot.

---

## ✦ Color & type

```
Ivory   #f6f1e4     Forest   #2f5d4a     Leather   #7a5236
Warm    #fbf7ee     Emerald  #133a2c     Gold      #c39b46
Paper   #f3ecdb     Deep     #0d2a20     Ink       #2a2118
```

**Fraunces** (serif, optical sizing) for display · **Inter** for body — both with
Vietnamese subsets.

---

## ✦ Deploy to Vercel

Push to GitHub, import in Vercel, add the env vars above. No extra config needed.
```bash
vercel --prod
```
