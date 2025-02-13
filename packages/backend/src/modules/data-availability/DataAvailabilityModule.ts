import type { Logger } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
import { DaService } from './services/DaService'

export function initDataAvailabilityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
  _peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.da) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  // TODO add for celestia and avail
  const blockProviders = providers.block
  const daProviders = providers.getDaProviders()
  const daService = new DaService(config.da.projects)
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: DaIndexer[] = []

  const daLayers = new Set([ProjectId('ethereum')])
  const ethStart = 19426618
  const batchSize = 2500
  // const daLayers = new Set(config.da.projects.map((p) => p.config.daLayer))

  for (const daLayer of daLayers.values()) {
    const blockTimestampProvider =
      blockProviders.getBlockTimestampProvider(daLayer)

    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      blockTimestampProvider,
      daLayer,
    )

    targetIndexers.push(targetIndexer)

    const configurations = config.da.projects.filter(
      (p) => p.config.daLayer === daLayer,
    )

    const daProvider = daProviders.getProvider(daLayer)

    const indexer = new DaIndexer({
      configurations: configurations.map((c) => ({
        id: c.configurationId,
        minHeight: ethStart,
        maxHeight: null,
        properties: {
          project: c.projectId,
          ...c.config,
        },
      })),
      daProvider,
      daService,
      logger,
      daLayer,
      batchSize,
      parents: [targetIndexer],
      indexerService,
      db: database,
      serializeConfiguration: (value: ProjectDaTrackingConfig) =>
        JSON.stringify(value),
    })
    daIndexers.push(indexer)
  }

  return {
    start: async () => {
      logger.info('Starting target indexers')
      await Promise.all(
        targetIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('Target indexers started')

      logger.info('Starting DA indexers')
      await Promise.all(
        daIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('DA indexers started')
    },
  }
}
