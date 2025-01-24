import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import {
  DaChallengeMechanism,
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
  DacTransactionDataType,
} from '../da-beat/types'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('xterio')

const daChallengeWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'challengeWindow',
  ) * 12, // in blocks, to seconds
)

const daResolveWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'resolveWindow',
  ) * 12, // in blocks, to seconds
)

export const xterio: Layer2 = opStackL2({
  createdAt: new UnixTime(1714996778), // 2024-05-06T11:59:38Z
  discovery,
  additionalBadges: [Badge.DA.CustomDA, Badge.RaaS.AltLayer],
  additionalPurposes: ['Gaming'],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    architectureImage: 'opstack-dachallenge',
    name: 'Xterio Chain',
    slug: 'xterio',
    description:
      'Xterio Chain is an OP stack Optimium on Ethereum. The chain focuses on gaming, high performance and low fees .',
    links: {
      websites: ['https://xter.io/'],
      apps: ['https://xter.io/', 'https://eth-bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: ['https://eth.xterscan.io/'],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://x.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/op-node%2Fv1.7.5',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  discoveryDrivenData: true,
  genesisTimestamp: new UnixTime(1716537433),
  rpcUrl: 'https://xterio-eth.alt.technology/',
  dataAvailabilitySolution: {
    type: 'DaLayer',
    kind: 'No DAC',
    display: {
      name: 'XterioDA',
      description:
        'XterioDA is a data availability solution using data availability challenges (DA Challenges).',
    },
    systemCategory: 'custom',
    fallback: DA_LAYERS.ETH_CALLDATA,
    challengeMechanism: DaChallengeMechanism.DaChallenges,
    technology: {
      description: `
      ## Architecture
      ![XterioDA layer](/images/da-layer-technology/xterioda/architecture.png#center)
  
      ## Data Availability Challenges
      Xterio relies on DA challenges for data availability. 
      The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
      If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
      A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
      In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
      The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
      If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.
    `,
      references: [
        {
          text: 'Alt-DA Specification',
          href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
        },
        {
          text: 'Security Considerations - Ethresear.ch ',
          href: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: `the sequencer posts an invalid data availability certificate and there are no challengers.`,
        },
        {
          category: 'Funds can be lost if',
          text: `the sequencer posts an invalid data availability certificate, and he is able to outspend the challengers.`,
        },
      ],
    },
    bridge: {
      createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
      type: 'IntegratedDacBridge',
      technology: {
        description: `Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
          However, there is a mechanism that allows users to challenge unavailability of data. \n`,
      },

      requiredMembers: 0,
      membersCount: 0,
      hideMembers: true,
      transactionDataType: DacTransactionDataType.TransactionData,
      risks: {
        committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
        upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
        relayerFailure: DaRelayerFailureRisk.NoMechanism,
      },
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
  },
})
