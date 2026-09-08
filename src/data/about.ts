import type { Philosophy, ToolGroup } from '@/types'

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
 * The toolkit as a type specimen: grouped by the capability the tools serve,
 * with `scale` encoding how central each tool is to the practice. Scale is a
 * real measurement (what gets reached for most), not decoration; retune it
 * here, not in the component.
 */
export const toolGroups: ToolGroup[] = [
  {
    label: 'Interface',
    tools: [
      { label: 'Figma', note: 'UX/UI, prototyping, systems', scale: 'md' },
    ],
  },
  {
    label: 'Form & CAD',
    tools: [
      { label: 'Blender', note: '3D modeling, render', scale: 'md' },
      { label: 'Fusion 360', note: 'CAD, mechanical form', scale: 'md' },
    ],
  },
  {
    label: 'Image & Print',
    tools: [
      { label: 'Photoshop', note: 'Compositing, product viz', scale: 'lg' },
      { label: 'Illustrator', note: 'Vector, iconography', scale: 'md' },
      { label: 'CorelDRAW', note: 'Print production', scale: 'sm' },
    ],
  },
  {
    label: 'Motion',
    tools: [
      { label: 'After Effects', note: 'Motion graphics', scale: 'md' },
      { label: 'Premiere', note: 'Edit, grade', scale: 'sm' },
    ],
  },
  {
    label: 'Automation',
    tools: [
      { label: 'Python', note: 'Scripts, macros', scale: 'md' },
      { label: 'Claude Code', note: 'AI-assisted development', scale: 'sm' },
      { label: 'ChatGPT', note: 'Research, ideation', scale: 'sm' },
    ],
  },
]
