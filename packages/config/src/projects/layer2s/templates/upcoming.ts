import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../../../common'
import type {
  ScalingProjectCapability,
  ScalingProjectDisplay,
} from '../../../types'
import type { BadgeId } from '../../badges'
import type { Layer3 } from '../../layer3s'
import type { Layer2, Layer2Display } from '../types'

export interface UpcomingConfigL2 {
  id: string
  createdAt: UnixTime
  display: Layer2Display
  capability: ScalingProjectCapability
  badges?: BadgeId[]
}

export interface UpcomingConfigL3 {
  id: string
  createdAt: UnixTime
  display: ScalingProjectDisplay
  capability: ScalingProjectCapability
  hostChain: Layer3['hostChain']
  badges?: BadgeId[]
}

export function upcomingL2(templateVars: UpcomingConfigL2): Layer2 {
  return {
    isUpcoming: true,
    type: 'layer2',
    id: ProjectId(templateVars.id),
    capability: templateVars.capability,
    createdAt: templateVars.createdAt,
    display: templateVars.display,
    stage: {
      stage: 'NotApplicable',
    },
    config: {
      escrows: [],
    },
    riskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
    badges: templateVars.badges,
  }
}

export function upcomingL3(templateVars: UpcomingConfigL3): Layer3 {
  return {
    isUpcoming: true,
    type: 'layer3',
    id: ProjectId(templateVars.id),
    capability: templateVars.capability,
    createdAt: templateVars.createdAt,
    display: {
      ...templateVars.display,
    },
    hostChain: templateVars.hostChain,
    config: {
      escrows: [],
    },
    stage: { stage: 'NotApplicable' },
    riskView: UPCOMING_RISK_VIEW,
    stackedRiskView: UPCOMING_RISK_VIEW,
    technology: TECHNOLOGY.UPCOMING,
    contracts: CONTRACTS.EMPTY,
    badges: templateVars.badges,
  }
}
