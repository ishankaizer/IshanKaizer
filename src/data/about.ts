import type { Philosophy, Tool } from '@/types'

export const about = {
  /** Short, spacious About. Kept deliberately minimal. */
  statement: 'I make things you touch, and things you tap.',
  sub: 'An industrial designer now designing the interfaces and shipping the code too. Based in Bengaluru.',
}

export const philosophies: Philosophy[] = [
  {
    label: 'On interfaces',
    text: 'UX is paying attention to how people move, hesitate, tap and get confused. When something works, users never think about the interface. They just keep going.',
  },
  {
    label: 'On objects',
    text: 'I’m drawn to physical products because they’re honest. You feel immediately whether something is uncomfortable, awkward or thoughtfully made. There’s nowhere to hide.',
  },
]

export const hobbies = [
  'Music',
  'Football',
  'Photography',
  'Travel',
  'Video editing',
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
