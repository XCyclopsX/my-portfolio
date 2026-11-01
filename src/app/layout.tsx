import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { SITE } from '@/data/portfolio'
import './globals.css'

// Self-hosted (latin, variable weight) so builds never depend on fetching Google Fonts.
// Both fonts are licensed under the SIL Open Font License.
const inter = localFont({ src: '../fonts/inter-latin-variable.woff2', weight: '300 600', variable: '--font-inter', display: 'swap' })
const syne = localFont({ src: '../fonts/syne-latin-variable.woff2', weight: '400 800', variable: '--font-syne', display: 'swap' })

const title = `${SITE.name} — ${SITE.title}`
const description = `Full-Stack Developer with ${SITE.experience} years building scalable web apps with React.js, Next.js, TypeScript, ASP.NET and SQL Server.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  keywords: ['Full-Stack Developer', 'Frontend Developer', 'React', 'ASP.NET', 'Next.js', 'TypeScript', 'Karachi', SITE.name],
  authors: [{ name: SITE.name, url: SITE.url }],
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: `Portfolio of ${SITE.name} — ${SITE.title} based in ${SITE.location}.`,
    url: '/',
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/me.jpg', alt: SITE.name }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/me.jpg'] },
}

export const viewport: Viewport = {
  themeColor: '#090909',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  )
}
