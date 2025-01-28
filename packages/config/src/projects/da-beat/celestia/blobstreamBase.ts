import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'
import { CELESTIA_BLOBSTREAM } from './template'

const discovery = new ProjectDiscovery('blobstream', 'base')

const maxRangeDataCommitment = discovery.getContractValue<number>(
  'Blobstream',
  'DATA_COMMITMENT_MAX',
)

const headerRangeProvers = discovery.getContractValue<string[]>(
  'SuccinctGateway',
  'headerRangeProvers',
)

const nextHeaderProvers = discovery.getContractValue<string[]>(
  'SuccinctGateway',
  'nextHeaderProvers',
)

export const blobstreamBase = CELESTIA_BLOBSTREAM({
  addedAt: new UnixTime(1719930680), // 2024-07-02T14:31:20Z
  display: {
    links: {
      websites: [],
      documentation: ['https://docs.celestia.org/developers/blobstream'],
      repositories: ['https://github.com/succinctlabs/blobstreamx'],
      apps: [],
      explorers: ['https://basescan.org/'],
      socialMedia: [],
    },
  },
  technology: {
    description: `
      The BlobstreamX bridge is a data availability bridge that facilitates data availability commitments to be bridged between Celestia and Base.
      The BlobstreamX bridge is composed of three main components: the **BlobstreamX** contract, the **Succinct Gateway** contract and the **Verifier** contracts.
      By default, BlobstreamX operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Celestia block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestDataHeader() method of the blobstreamX smart contract.
      Once a proving request is received, the off-chain prover generates the proof and submits it to the Succinct Gateway contract. The Succinct Gateway contract verifies the proof with the corresponding verifier contract and, if successful, calls the blobstreamX contract to store the data commitment.
      Alternatively, it is possible to run a Blobstream X operator with local proving, allowing for self-generating the proofs.

      Verifying a header range includes verifying tendermint consensus (header signatures are 2/3 of stake) and verifying the data commitment root. This is achieved through a combined circuit. This combined circuit is made up of two parts:
      1) **TendermintX** circuit is used to verify tendermint consensus,
      2) **BlobstreamX** circuit is used to verify the data commitment root.
      
      By default, BlobstreamX on Base is updated by the Celestia operator at a regular cadence of 1 hour.
    `,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by a dishonest supermajority of Celestia validators.',
      },
    ],
  },
  contracts: {
    addresses: {
      base: [
        discovery.getContractDetails('Blobstream', {
          description:
            'The Blobstream DA bridge. This contract is used to bridge data commitments between Celestia and Ethereum.',
        }),
        discovery.getContractDetails(
          'headerRangeVerifier',
          `Verifier contract for the header range [latestBlock, targetBlock] proof.
        A request for a header range can be at most ${maxRangeDataCommitment} blocks long. The proof is generated by an off-chain prover and submitted by a relayer.`,
        ),
        discovery.getContractDetails(
          'nextHeaderVerifier',
          'Verifier contract for a single header proof. Used in the rare case in which the validator set changes by more than 2/3 in a single block.',
        ),
        discovery.getContractDetails('SuccinctGateway', {
          description: `This contract is the router for the bridge proofs verification. It stores the mapping between the functionId of the bridge circuit and the address of the onchain verifier contract.
        Users can interact with this contract to request proofs onchain, emitting a RequestCall event for off-chain provers to consume. Once a proof is generated, this contract is used as the onchain entry point for relayers to fulfill the request and submit the proof.`,
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
  },
  permissions: {
    base: [
      ...discovery.getMultisigPermission(
        'BlobstreamMultisig',
        'This multisig is the admin of the Blobstream contract. It holds the power to change the contract state and upgrade the bridge.',
      ),
      ...discovery.getMultisigPermission(
        'SuccinctGatewayMultisig',
        'This multisig is the admin of the SuccinctGateway contract. As the manager of the entry point and router for proof verification, it holds the power to affect the liveness and safety of the bridge.',
      ),
      {
        name: 'headerRangeProvers',
        chain: 'base',
        description: `List of prover (relayer) addresses that are allowed to call fulfillCallback()/fulfillCall() in the SuccinctGateway for the headerRange function ID of BlobstreamX.`,
        accounts: headerRangeProvers.map((headerRangeProver) => ({
          address: EthereumAddress(headerRangeProver),
          type: 'EOA',
        })),
      },
      {
        name: 'nextHeaderProvers',
        chain: 'base',
        description: `List of prover (relayer) addresses that are allowed to call fulfillCallback()/fulfillCall() in the SuccinctGateway for the nextHeader function ID of BlobstreamX.`,
        accounts: nextHeaderProvers.map((nextHeaderProver) => ({
          address: EthereumAddress(nextHeaderProver),
          type: 'EOA',
        })),
      },
    ],
  },
  usedIn: [
    // no project integrates it for state validation
  ],
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.RobustAndDiverseCommittee(
      'Celestia Validators',
    ),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0), // TIMELOCK_ROLE is 4/6 multisig
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
})
