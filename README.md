# Saad Uddin Siddiqui — Portfolio

Personal portfolio site built with **Next.js 15 (App Router)**, **TypeScript** and **GSAP** scroll animations, with a working contact form backed by Nodemailer.

## Features

- Scroll-driven sticky scenes on desktop with a simplified, fully responsive layout on mobile
- Static sections rendered as React Server Components; client JS limited to animations, nav and the contact form
- Contact form with shared client/server validation, honeypot and rate limiting
- Accessible: semantic landmarks, keyboard-navigable, labelled form fields, WCAG AA contrast, `prefers-reduced-motion` support
- SEO: Open Graph/Twitter metadata, `robots.txt`, `sitemap.xml`, generated favicon
- Optimised fonts (`next/font`) and images (`next/image`)

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15, React 19, TypeScript |
| Animation | GSAP + ScrollTrigger |
| Email | Nodemailer (Gmail SMTP) |
| Quality | ESLint (`next/core-web-vitals`), `tsc --noEmit` |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Description |
| --- | --- |
| `GMAIL_USER` | Gmail address used to send mail |
| `GMAIL_APP_PASSWORD` | Gmail [App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification) |
| `CONTACT_RECEIVER` | Inbox that receives contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the deployed site (used for metadata, sitemap, robots) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with TypeScript |

## Project structure

```
src/
├── app/                 # Routes, layout, metadata, API route, robots/sitemap/icon
│   └── api/contact/     # Contact form endpoint
├── components/          # Nav, Hero, ContactForm, ScrollEffects (animations)
│   └── sections/        # About, Experience, Projects, Education, Footer
├── data/portfolio.ts    # All site content — edit this to update the portfolio
└── lib/                 # Validation, mailer, rate limiting, scroll helpers
```

## Deployment

Deploy on [Vercel](https://vercel.com): import the repository and add the environment variables above in the project settings.
