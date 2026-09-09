import type { Philosophy, Tool } from '@/types'

export const about = {
  /** Short, spacious About, in the owner's own voice. */
  statement: 'Here for a good time, not a long time. Unless it’s at YOUR company.',
  sub: 'An industrial designer who just loves good design. Outside of that, you will find me having a beer, playing sports with my friends, or otherwise just living a fun, meaningful life in good company.',
}

/**
 * The two cards in "Two mediums, one instinct". Hovering a card hides the
 * other card's text and shows this card's `image` in its place.
 */
export const philosophies: Philosophy[] = [
  {
    label: 'On interfaces',
    title: 'Tap',
    text: 'UX is paying attention to how people move, hesitate, tap and get confused. When something works, users never think about the interface. They just keep going.',
    image: {
      src: '/apart/old-man.webp',
      alt: 'An old man in a suit leaning in very close to a computer monitor',
      width: 900,
      height: 1200,
    },
  },
  {
    label: 'On objects',
    title: 'Touch',
    text: 'I’m drawn to physical products because they’re honest. You feel immediately whether something is uncomfortable, awkward or thoughtfully made. There’s nowhere to hide.',
    image: {
      src: '/apart/orangutan.webp',
      alt: 'An orangutan sawing a branch with a hand saw',
      width: 460,
      height: 460,
    },
  },
]

/**
 * The toolkit, in order of reach. Each tool owns one of the owner's
 * illustrated folder icons (cut out with `scripts/cutout.py` into /tools).
 */
export const tools: Tool[] = [
  { label: 'Figma', icon: '/tools/figma.webp', width: 320, height: 266 },
  { label: 'Photoshop', icon: '/tools/photoshop.webp', width: 320, height: 265 },
  { label: 'Blender', icon: '/tools/blender.webp', width: 320, height: 266 },
  { label: 'Fusion 360', icon: '/tools/fusion-360.webp', width: 320, height: 265 },
  { label: 'Illustrator', icon: '/tools/illustrator.webp', width: 320, height: 265 },
  { label: 'After Effects', icon: '/tools/after-effects.webp', width: 320, height: 266 },
  { label: 'Premiere', icon: '/tools/premiere.webp', width: 320, height: 265 },
  { label: 'Python', icon: '/tools/python.webp', width: 320, height: 266 },
  { label: 'CorelDRAW', icon: '/tools/coreldraw.webp', width: 320, height: 266 },
  { label: 'Claude Code', icon: '/tools/claude-code.webp', width: 320, height: 266 },
  { label: 'ChatGPT', icon: '/tools/chatgpt.webp', width: 320, height: 267 },
]
