import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const aiechain: Layer2 = upcomingL2({
  id: 'aiechain',
  capability: 'universal',
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  display: {
    name: 'AIE Chain',
    slug: 'aie-chain',
    description:
      'AIE Chain is an upcoming Layer 2 on Ethereum dedicated to organizing, categorizing, and distributing AI creations. Built using the Orbit stack and leveraging EigenDA for data availability, ensuring security and scalability.',
    purposes: ['AI'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://genesis.aielabs.io/'],
      apps: [],
      documentation: ['https://docs.aielabs.io'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/AIE_Labs',
        'https://t.me/aielabsnews',
        'https://discord.gg/ZrQYEE2m9s',
      ],
    },
  },
})
