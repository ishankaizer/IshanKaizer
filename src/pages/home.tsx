import { Seo } from '@/components/common/seo'
import { Hero } from '@/sections/hero'
import { TermsBanner } from '@/sections/terms-banner'
import { SelectedWork } from '@/sections/selected-work'
import { About } from '@/sections/about'
import { Experience } from '@/sections/experience'
import { Apart } from '@/sections/apart'
import { Music } from '@/sections/music'
import { Skills } from '@/sections/skills'
import { LightBand } from '@/sections/light-band'
import { Contact } from '@/sections/contact'

export function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <TermsBanner />
      <SelectedWork />
      <About />
      <Music />
      <Experience />
      <Apart />
      <Skills />
      <LightBand />
      <Contact />
    </>
  )
}
