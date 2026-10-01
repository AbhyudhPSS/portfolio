import { useCallback, useMemo, useState } from 'react'
import { Boot } from './components/Boot'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { SECTIONS } from './data/nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { About } from './components/About'
import { Work } from './components/Work'
import { Stack } from './components/Stack'
import { Log } from './components/Log'
import { Achievements } from './components/Achievements'
import { Beliefs } from './components/Beliefs'
import { Desk } from './components/Desk'
import { Outside } from './components/Outside'
import { Connect } from './components/Connect'
import { Footer } from './components/Footer'
import {
  useActiveSection,
  useActiveSurface,
  useFinePointer,
  useReducedMotion,
} from './lib/hooks'
import { useLenis } from './lib/useLenis'
import { initSfx, setSfx } from './lib/sfx'

export default function App() {
  const reduce = useReducedMotion()
  const finePointer = useFinePointer()
  const [booted, setBooted] = useState(false)
  const [sound, setSound] = useState(() => initSfx())

  // Smooth scroll only once the boot panel is out of the way.
  useLenis(booted && !reduce)

  const surface = useActiveSurface()
  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])
  const active = useActiveSection(ids)

  const toggleSound = useCallback(() => {
    setSound((on) => {
      setSfx(!on)
      return !on
    })
  }, [])

  const onBootDone = useCallback(() => setBooted(true), [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Boot onDone={onBootDone} skip={reduce} />
      {finePointer && !reduce && <Cursor surface={surface} />}

      <Nav
        active={active}
        surface={surface}
        sound={sound}
        onToggleSound={toggleSound}
      />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Stack />
        <Log />
        <Achievements />
        <Beliefs />
        <Desk />
        <Outside />
        <Connect />
      </main>

      <Footer />
    </>
  )
}
