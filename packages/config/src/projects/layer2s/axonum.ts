import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const axonum: Layer2 = upcomingL2({
  id: 'axonum',
  capability: 'universal',
  createdAt: new UnixTime(1715871969), // 2024-05-16T15:06:09Z
  display: {
    name: 'Axonum',
    slug: 'axonum',
    description:
      'Axonum is an OP Stack L2 with a precompile to access AI inference directly from smart contracts.',
    purposes: ['Universal', 'AI'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://axonum.io'],
      apps: ['https://app.axonum.io/bridge/deposit'],
      documentation: ['https://docs.axonum.io'],
      explorers: ['https://sepolia-explorer.axonum.io'],
      repositories: ['https://github.com/axonum'],
      socialMedia: [
        'https://twitter.com/axonum_io',
        'https://mirror.xyz/brainof.eth',
      ],
    },
  },
})
