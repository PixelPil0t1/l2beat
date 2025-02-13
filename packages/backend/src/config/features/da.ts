import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'

import { createHash } from 'crypto'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'

export async function getDaTrackingConfig(
  ps: ProjectService,
  env: Env,
): Promise<DataAvailabilityTrackingConfig> {
  // TODO: automate it
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BLOBSCAN_API_URL')
  const celestiaEnabled = !!env.optionalString('CELESTIA_BLOBS_API_URL')
  const availEnabled = !!env.optionalString('AVAIL_BLOBS_API_URL')

  const layers = []

  if (ethereumEnabled) {
    layers.push({
      type: 'ethereum' as const,
      name: 'ethereum',
      url: env.string('ETHEREUM_BLOBSCAN_API_URL'),
      callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 60),
      batchSize: 2500,
      startingBlockNumber: 19426618,
    })
  }

  if (celestiaEnabled) {
    layers.push({
      type: 'celestia' as const,
      name: 'celestia',
      url: env.string('CELESTIA_BLOBS_API_URL'),
      callsPerMinute: env.integer('CELESTIA_BLOBS_API_CALLS_PER_MINUTE', 2000),
      batchSize: 30,
      startingBlockNumber: 1,
    })
  }

  if (availEnabled) {
    layers.push({
      type: 'avail' as const,
      name: 'avail',
      url: env.string('AVAIL_BLOBS_API_URL'),
      callsPerMinute: env.integer('AVAIL_BLOBS_API_CALLS_PER_MINUTE', 2000),
      batchSize: 30,
      startingBlockNumber: 1,
    })
  }

  return {
    layers,
    projects: await getDaTrackingProjects(ps),
  }
}

async function getDaTrackingProjects(ps: ProjectService) {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects.map((project) => ({
    configurationId: createDaTrackingId(project.daTrackingConfig),
    projectId: project.id,
    config: project.daTrackingConfig,
  }))
}

function createDaTrackingId(config: ProjectDaTrackingConfig): string {
  const input = []

  input.push(config.type)
  input.push(config.daLayer)

  switch (config.type) {
    case 'ethereum':
      input.push(config.inbox)
      if (config.sequencers) {
        input.push(...config.sequencers.sort((a, b) => a.localeCompare(b)))
      }
      break
    case 'celestia':
      input.push(config.namespace)
      break
    case 'avail':
      input.push(config.appId)
      break

    default:
      assertUnreachable(config)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
