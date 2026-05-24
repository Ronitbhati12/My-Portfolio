# My Portfolio

An immersive portfolio website for Ronit Bhati built with React and Vite. The project focuses on cinematic motion, layered visuals, and scroll-driven storytelling to present frontend work in a more memorable way than a standard portfolio grid.

## Overview

This site combines animation-heavy UI work with reusable React components. The experience includes an intro sequence, themed sections, custom motion systems, manifesto storytelling cards, and a horizontally scrolling project showcase.

## Highlights

- Story-led landing experience with a motion-rich intro and 3D particle background
- Smooth scrolling and scroll-reactive sections powered by GSAP and Framer Motion
- Theme toggle with glassmorphism styling and ambient background effects
- Interactive manifesto cards, animated skill panels, and a horizontal project gallery
- Responsive single-page layout designed to showcase personal branding and selected work

## Tech Stack

- React 19
- Vite 8
- Framer Motion
- GSAP with ScrollTrigger
- Three.js with React Three Fiber and Drei
- Lenis
- Lucide React

## Project Structure

```text
.
|-- public/
|   |-- doodles/
|   |-- favicon.svg
|   |-- icons.svg
|   `-- manifesto-photo.png
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- Background/
|   |   |-- Cards/
|   |   |-- Cursor/
|   |   |-- Intro/
|   |   |-- Manifesto/
|   |   |-- Preloader/
|   |   |-- Projects/
|   |   |-- Skills/
|   |   |-- SmoothScroll/
|   |   `-- Transitions/
|   |-- App.jsx
|   |-- ThemeContext.jsx
|   |-- theme-context.js
|   |-- useTheme.js
|   |-- index.css
|   `-- main.jsx
|-- eslint.config.js
|-- index.html
|-- package.json
`-- vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
git clone https://github.com/Ronitbhati12/My-Portfolio.git
cd My-Portfolio
npm install
```

### Run Locally

```bash
npm run dev
```

The Vite dev server will start locally and hot-reload as you edit the project.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build in `dist/`
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint across the project

## Customization Guide

If you want to reuse or polish this portfolio further, these are the first places to update:

- Replace placeholder project URLs in `src/components/Projects/ProjectGallery3D.jsx`
- Update social links, contact details, and footer links in `src/App.jsx`
- Swap portfolio images inside `src/assets/` with your final branded visuals
- Adjust colors, typography, and global tokens in `src/index.css`
- Tune story pacing or skip logic in `src/components/Intro/StoryIntro.jsx`

## GitHub Readiness

This repository now includes:

- A stronger `.gitignore` for Node, Vite, editor files, build output, caches, and local env files
- Project-specific package metadata instead of the default Vite starter values
- A portfolio-specific HTML title and meta description
- Local doodle assets under `public/doodles/` so the skill cards do not rely on missing files

## Deployment Notes

This project is ready to deploy on platforms like Vercel or Netlify.

1. Install dependencies with `npm install`
2. Build the app with `npm run build`
3. Publish the generated `dist/` folder

If you deploy under a subpath instead of the domain root, update the Vite `base` setting in `vite.config.js`.

## Repository Notes

- `package-lock.json` is intentionally committed to keep installs reproducible
- `node_modules/` and `dist/` should stay untracked
- The project is marked `private` in `package.json` to prevent accidental npm publishing
