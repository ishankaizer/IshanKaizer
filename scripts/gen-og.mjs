// Generates public/og.png (1200x630), the social share card.
// Run: node scripts/gen-og.mjs
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const paper = '#fbf7f2'
const ink = '#17141b'
const inkSoft = '#4a4453'
const inkMute = '#6b6475'
const brand = '#d8235a'

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${paper}"/>
  <defs>
    <radialGradient id="glow" cx="88%" cy="6%" r="60%">
      <stop offset="0%" stop-color="${brand}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${brand}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="90" y="132" font-family="Arial, sans-serif" font-size="24" letter-spacing="5" fill="${inkMute}">PORTFOLIO &#183; 2026</text>

  <text x="84" y="300" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="164" letter-spacing="-6" fill="${ink}">Ishan</text>
  <text x="84" y="452" font-family="Georgia, serif" font-style="italic" font-size="168" fill="${brand}">Kaizer</text>

  <rect x="90" y="500" width="54" height="4" fill="${brand}"/>
  <text x="90" y="536" font-family="Arial, sans-serif" font-size="28" letter-spacing="1" fill="${inkSoft}">I design things you touch &amp; screens you tap.</text>
</svg>`

mkdirSync(resolve(root, 'public'), { recursive: true })

function renderPng(svgStr, width, out) {
  const r = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } })
  const png = r.render().asPng()
  writeFileSync(resolve(root, out), png)
  console.log('Wrote', out, png.length, 'bytes')
}

renderPng(svg, 1200, 'public/og.png')

// Monogram icons (Apple touch + PWA manifest).
const icon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${ink}"/>
  <text x="256" y="352" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="270" letter-spacing="-14" fill="#ffffff">I<tspan fill="${brand}">K</tspan></text>
</svg>`

renderPng(icon(180), 180, 'public/apple-touch-icon.png')
renderPng(icon(192), 192, 'public/icon-192.png')
renderPng(icon(512), 512, 'public/icon-512.png')
