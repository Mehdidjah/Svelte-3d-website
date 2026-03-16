# Svelte-3D

Svelte-3D is a personal SvelteKit project by Mehdi focused on motion, depth, and interactive storytelling. It combines a full-screen Three.js hand scene, scroll-driven transitions, animated typography, and horizontally moving content blocks to create a portfolio-style landing page that feels more like a product experience than a static site.

The project is built as a single-page immersive experience. The copy, layout rhythm, intro sequence, and 3D behavior are intentionally tightly coupled, so most of the engineering work is about preserving smoothness, timing, and visual clarity while keeping the codebase maintainable.

## What the project includes

- A fullscreen Three.js scene with a hand model, particles, and shader-based effects
- Scroll-driven section transitions powered by a dedicated smooth-scroll store and GSAP `ScrollTrigger`
- An animated intro overlay and wordmark transition
- Horizontal card movement and parallax sections tied to scroll position
- Responsive layout behavior for desktop and mobile
- Type-checked Svelte 5 and SvelteKit 2 setup
- Vercel-ready deployment output using `@sveltejs/adapter-vercel`

## Stack

- Svelte 5
- SvelteKit 2
- Vite 8
- TypeScript
- Three.js
- GSAP + `ScrollTrigger`
- Sass
- Vitest
- Playwright
- ESLint + Prettier

## Project structure

```text
src/
  routes/
    +layout.svelte        App shell, smooth-scroll bootstrapping, global layout
    +page.svelte          Main landing page sections and scroll choreography
  lib/
    components/
      Hand/               3D hand scene, loaders, renderer, particles, materials
      FeatureCards/       Feature card section
      HorizontalSlides.svelte
      Parallax.svelte
      Intro.svelte
      Title.svelte
    actions/
      intersection.ts     Visibility action for reveal logic
    lifecycle-functions/
      useScroll.ts        Scroll subscription helper
    stores/
      threejsHand.ts      Shared smooth-scroll engine store
static/
  models/                 GLB assets used by the hand scene
  fonts/                  Display and body fonts
tests/
  test.ts                 Playwright homepage smoke test
```

## Key implementation notes

### 3D scene

The page uses a persistent canvas layer rendered behind the content. The hand scene lives under `src/lib/components/Hand/` and includes:

- GLB model loading
- custom material setup
- particle shaders in `src/lib/components/Hand/particles/`
- animation steps and renderer setup

### Scroll system

The site depends on a shared smooth-scroll engine exposed through `src/lib/stores/threejsHand.ts`. Layout-level scroll updates are synchronized with GSAP so section thresholds, parallax behavior, the progress bar, and horizontal slides all react to the same scroll source.

### Motion-heavy sections

The most timing-sensitive parts of the homepage are:

- the intro overlay
- the hero reveal
- the horizontal card rail
- the zoom/reveal section
- the light-theme transition and project list reveal

If you change these sections, verify behavior in the browser rather than relying only on type checks.

## Requirements

- Node.js `20.19.0` or newer
- npm

The project currently declares:

```bash
node >= 20.19.0
```

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

If you want the server exposed on a specific host:

```bash
npm run dev -- --host 127.0.0.1
```

## Quality checks

Type check the app:

```bash
npm run check
```

Run unit tests:

```bash
npm run test:unit -- --run
```

Run the Playwright smoke test:

```bash
npm test
```

Format and lint:

```bash
npm run format
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment variables

Analytics variables are optional. If they are not set, the site still runs.

```bash
VITE_GOOGLE_TAG_MANAGER_ID=
VITE_GOOGLE_ANALYTICS=
```

These are read in `src/lib/utils/analytics.ts`.

## Deploying to Vercel

The project is configured for Vercel with `@sveltejs/adapter-vercel`. No extra adapter setup is required.

Typical Vercel settings:

- Framework preset: `SvelteKit`
- Install command: `npm install`
- Build command: `npm run build`
- Output: handled automatically by the adapter

The current adapter configuration targets the Node.js 20 runtime. A successful local build generates `.vercel/output/`, which is the same output format Vercel expects.

## Current homepage behavior

The smoke test validates the main experience that should remain intact:

- page title is `Svelte-3D`
- hero copy includes `A new Svelte-3D website`
- the main canvas is present
- the GitHub CTA is visible
- no page-level runtime errors are thrown during initial load

## Notes for future edits

- Preserve scroll timing when changing section heights or sticky behavior
- Recheck the horizontal slides if card widths or wrappers change
- Recheck the intro on desktop after any wordmark or transition edits
- Rebuild before deploying, especially after touching the 3D scene or layout bootstrapping
