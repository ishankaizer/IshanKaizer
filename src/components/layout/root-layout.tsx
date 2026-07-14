import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { BackgroundField } from '@/components/common/background-field'
import { Nav } from './nav'
import { Footer } from './footer'

export function RootLayout() {
  return (
    <>
      <BackgroundField />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <span id="top" aria-hidden />
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="min-h-[60svh]" aria-hidden />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
