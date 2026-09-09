import type { CaseStudy } from '@/types'

export const materia: CaseStudy = {
  hook: 'A material-discovery platform for interior designers. I designed it and shipped it as a working React product, not just a prototype.',
  overview: {
    timeline: 'Ongoing · 2025',
    team: 'Design + front-end (me), with product feedback',
    platform: 'Responsive web app (React)',
    tools: ['Figma', 'React', 'Photoshop', 'Python'],
  },
  problem: [
    'Interior designers lose hours hunting for the right tile, laminate, stone or veneer across scattered vendor catalogues, PDFs and WhatsApp forwards. Discovery is slow, comparison is manual, and the specification that comes out of it is easy to get wrong.',
  ],
  contributions: [
    'Information architecture, browse and material-detail experiences.',
    'Front-end built in React: a live product, not a clickable mockup.',
    'Visualization system, with Python automating catalogue imagery at volume.',
  ],
}
