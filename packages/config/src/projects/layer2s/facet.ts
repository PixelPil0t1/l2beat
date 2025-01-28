import { EthereumAddress } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { FORCE_TRANSACTIONS, OPERATOR, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('facet')
const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

export const facet: Layer2 = opStackL2({
  addedAt: new UnixTime(1735889012), // 2025-01-03T01:36:52Z
  discovery,
  additionalBadges: [Badge.Other.BasedSequencing],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Facet',
    slug: 'facet',
    description:
      'Facet is a based rollup built on the OP stack. It uses FCT as its native gas token, which is mintable by spending gas on L1.',
    links: {
      websites: ['https://facet.org/'],
      apps: ['https://facetswap.com/bridge'],
      documentation: ['https://docs.facet.org/'],
      explorers: ['https://explorer.facet.org/'],
      repositories: ['https://github.com/0xFacet'],
      socialMedia: [
        'https://x.com/0xFacet',
        'https://discord.com/invite/facet',
      ],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x0000000000000b07ED001607f5263D85bf28Ce4C'),
      tokens: ['ETH'],
      description: 'Fast bridge contract.',
    }),
  ],
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  nonTemplateTechnology: {
    operator: OPERATOR.DECENTRALIZED_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.CANONICAL_ORDERING('EOA inbox'),
    exitMechanisms: [
      {
        name: 'Withdrawals are initiated on L1',
        description:
          'Users can initiate a withdrawal from the L1StandardBridge escrow by sending a transaction to the L1 contract, forcing the operator to either process it, halt all withdrawals or produce an invalid state transition. Deposits from the L1StandardBridge are disabled, and the use of the fast bridge is encouraged. There is no way to force the fast bridge operator (EOA) to process a withdrawal.',
        references: [
          {
            title:
              'PausedL1StandardBridge.sol - Etherscan source code, disabled _initiateBridgeERC20 function',
            url: 'https://etherscan.io/address//0x8F75466D69a52EF53C7363F38834bEfC027A2909#code',
          },
        ],
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the fast bridge EOA operator signs an invalid withdrawal.',
            isCritical: true,
          },
          {
            category: 'Funds can be frozen if',
            text: 'the operator halts withdrawals.',
            isCritical: true,
          },
        ],
      },
    ],
  },
  architectureImage: 'facet',
  rpcUrl: 'https://mainnet.facet.org/',
  genesisTimestamp: new UnixTime(1733855495),
  milestones: [
    {
      title: 'Facet Mainnet Launch',
      url: 'https://x.com/0xFacet/status/1866610169620336761',
      date: '2024-12-10T00:00:00Z',
      description: 'Facet launches at Ethereum block 21373000.',
      type: 'general',
    },
  ],
  discoveryDrivenData: true,
  usesBlobs: false, // uses calldata
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/0xFacet/facet-node',
})
