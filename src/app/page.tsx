import ContactForm from '@/components/ContactForm'
import Hero from '@/components/Hero'
import Nav from '@/components/Nav'
import ScrollEffects from '@/components/ScrollEffects'
import About from '@/components/sections/About'
import Education from '@/components/sections/Education'
import Experience from '@/components/sections/Experience'
import Footer from '@/components/sections/Footer'
import Marquee from '@/components/sections/Marquee'
import Projects from '@/components/sections/Projects'
import { SceneStage } from '@/components/sections/Scene'

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollEffects />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <SceneStage ids={['about-scene', 'exp-scene', 'proj-scene', 'edu-scene']}>
          <About />
          <Experience />
          <Projects />
          <Education />
        </SceneStage>
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
