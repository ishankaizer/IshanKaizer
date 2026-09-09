import type { CaseStudy } from '@/types'

export const levelstretch: CaseStudy = {
  hook: 'A self-leveling ambulance stretcher that keeps a patient stable on rough roads and streams live vitals to the hospital before arrival. Industrial design meets connected health.',
  overview: {
    timeline: '14 weeks · 2024',
    team: 'Solo: industrial design, systems, companion app',
    platform: 'Medical device + hospital app',
    tools: ['Fusion 360', 'Blender', 'Figma', 'Arduino (concept)'],
  },
  problem: [
    'On the way to a hospital, the road and the clock both work against the patient. Uneven roads tilt and jolt a stretcher, worsening conditions like spinal injury or shock, and the receiving team often learns the patient’s state only when the doors open.',
  ],
  contributions: [
    'Mechanical concept for a gyro-stabilised, self-leveling platform.',
    'Industrial form for real ambulance constraints: loading, weight, cleaning.',
    'Live-vitals streaming and the hospital app that receives it.',
  ],
}
