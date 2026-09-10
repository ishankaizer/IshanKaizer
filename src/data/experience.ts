import type { ExperienceRole } from '@/types'

/** The receipt's footer lines. The auth code is his college roll number. */
export const receipt = {
  order: '0003',
  total: '4 YRS',
  auth: '22BID0009',
  thanks: 'Thank you for scrolling!',
}

export const experience: ExperienceRole[] = [
  {
    when: 'Jul 2026 – Present',
    role: 'Design Lead',
    org: 'Sangeeth Samuel Design',
    points: [],
  },
  {
    when: 'Feb – Jun 2026',
    role: 'Product Visualization & Design Intern',
    org: 'Material Depot',
    location: 'Bengaluru',
    points: [
      'Designed product-visualization mockups and explanatory graphics for materialdepot.in.',
      'Directed 8ft × 4ft in-store display boards that unified the digital and physical brand.',
      'Automated recurring Photoshop, Illustrator and CorelDRAW work with Python, cutting production time on high-volume catalog output.',
      'Rebuilt the vendor asset and print-production workflow end to end.',
    ],
  },
  {
    when: 'Nov 2025 – Feb 2026',
    role: 'Graphic Designer Intern',
    org: 'Prime Events & Conferences',
    location: 'Bengaluru',
    points: [
      'Modeled 3D exhibition-booth mockups in Blender ahead of fabrication.',
      'Rebuilt a wildlife magazine’s social presence with a cohesive visual system.',
      'Produced event collateral and edited promo video for live LED displays.',
    ],
  },
  {
    when: 'Aug – Oct 2025',
    role: 'Design Team Organizer',
    org: 'Gravitas Tech Fest, VIT',
    points: [
      'Led a 40-member design and media team owning the festival’s visual identity.',
      'Partnered cross-functionally to keep design output aligned across every team.',
    ],
  },
  {
    when: '2024 – 2025',
    role: 'Design Team Member · Intern',
    org: 'Riviera ’25 · Gravitas ’24 · CIPET Mysore',
    points: [
      'Festival design teams and a plastics-engineering internship (CIPET, 2025).',
    ],
  },
  {
    when: '2022 – 2026',
    role: 'B.Des, Industrial Design',
    org: 'Vellore Institute of Technology',
    points: [
      'Final year. Product design, visualization and UX/UI.',
    ],
  },
]
