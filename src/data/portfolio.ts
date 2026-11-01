/** Update once a year — used across the hero, About section, stats and SEO */
const EXPERIENCE_YEARS = '4+'

export const SITE = {
  name: 'Saad Uddin Siddiqui',
  shortName: 'S.U.S',
  title: 'Full-Stack Developer',
  experience: EXPERIENCE_YEARS,
  tagline: `Full-Stack Developer — ${EXPERIENCE_YEARS} years building scalable web apps with React.js, Next.js, TypeScript and .NET.`,
  location: 'Karachi, Pakistan',
  email: 'saad.uddin9900@gmail.com',
  phone: { display: '+92 310 920 5857', href: 'tel:+923109205857' },
  linkedin: 'https://www.linkedin.com/in/saad-uddin-siddiqui-606a10274',
  github: 'https://github.com/XCyclopsX',
  resume: { href: '/resume.pdf', fileName: 'Saad-Uddin-Siddiqui-CV.pdf' },
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

export const SKILLS = [
  'React.js', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Vue.js', 'jQuery', 'HTML5 / CSS3',
  'ASP.NET MVC', '.NET Core', 'Laravel', 'PHP', 'Node.js (basic)', 'REST APIs',
  'SQL Server', 'PostgreSQL', 'MySQL', 'Stored Procedures', 'Multi-Tenancy', 'Git',
]

export const AWARDS = [
  { icon: '🎖️', title: 'Award of Appreciation ×2', org: 'Alpha Education Network · Annual Function 2023 & 2024', count: 2 },
  { icon: '🏆', title: 'Creative Bit of the Year', org: 'Aptech Pakistan · 2-hour build competition, 2020', count: 1 },
  { icon: '🥇', title: 'Project of the Month ×2', org: 'Aptech Pakistan · SRS Electronics, Walter Bros', count: 2 },
]

const AWARD_COUNT = AWARDS.reduce((sum, a) => sum + a.count, 0)

export const STATS = [
  { value: EXPERIENCE_YEARS, label: 'Years experience' },
  { value: '5+', label: 'Projects shipped' },
  { value: String(AWARD_COUNT), label: 'Awards won' },
]

export interface Project {
  num: string
  title: string
  desc: string
  tags: string[]
  date: string
  featured?: boolean
  awards?: string[]
  /** Omit for internal / NDA projects that have no public link */
  link?: string
}

export const PROJECTS: Project[] = [
  { num: '01', featured: true, title: 'Alpha ERP', desc: 'Complete ERP with schooling modules — Inventory, ECA, Academics, Accounts, Attendance, Associate Teacher.', tags: ['ASP.NET MVC', 'SQL Server', 'REST APIs', 'React.js'], date: 'Sep 2022 — Oct 2025' },
  { num: '02', title: 'Admission Module', desc: 'Student admissions end-to-end — JotForm apply, team tracking, offer letters, enrollment.', tags: ['SQL Server', 'Stored Procedures'], date: 'Apr — Aug 2025' },
  { num: '03', title: 'TextUtils', desc: 'React.js text modification tool. Clean UX, open-source.', tags: ['React.js'], date: 'Jan 2024', link: 'https://xcyclopsx.github.io/TextUtils/' },
  { num: '04', title: 'SRS Electronics', desc: 'E-commerce web application built as a semester project, showcasing full-stack development.', tags: ['PHP', 'CSS'], date: 'Feb — Mar 2021', awards: ['Project of the Month'], link: 'https://github.com/XCyclopsX/SRSElectronics' },
  { num: '05', title: 'Walter Bros Inc.', desc: 'Cartoon streaming and merch site for kids. Vue.js semester project.', tags: ['Vue.js', 'HTML5'], date: 'Oct — Nov 2019', awards: ['Project of the Month'], link: 'https://github.com/XCyclopsX/WalterBros' },
]

export const EXPERIENCE = [
  { date: 'Oct 2025 — Present', company: 'SKONZS', role: 'Software Developer · React.js · Frontend · PostgreSQL' },
  { date: 'Sep 2022 — Oct 2025', company: 'Alpha Education Network', role: 'Mid Software Developer · HowlTech (Pty) Ltd · React.js · Full Stack ASP.NET MVC · UAT Tester · Trainer' },
]

export const EDUCATION = [
  { year: 'Apr 2024 — Present (In Progress)', degree: 'Bachelor of Business & Information Technology (BBIT)', school: 'Virtual University of Pakistan' },
  { year: 'Nov 2019 — Aug 2022', degree: 'Advance Diploma — Software Engineering', duration: '3 years', school: 'Aptech Pakistan' },
  { year: '2017 — 2020', degree: 'H.S.C (Intermediate)', school: 'Shipowners College Karachi' },
  { year: 'Matriculation', degree: 'Computer Science', school: 'Bahria Foundation College — North Nazimabad' },
]


export const NAV_LINKS = [
  { label: 'About', target: 'about-scene' },
  { label: 'Experience', target: 'exp-scene' },
  { label: 'Projects', target: 'proj-scene' },
  { label: 'Contact', target: 'contact' },
]
