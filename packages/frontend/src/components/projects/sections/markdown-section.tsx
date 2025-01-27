import { type ScalingProjectReference } from '@l2beat/config'
import { DiagramImage } from '~/components/diagram-image'
import {
  type DiagramType,
  getDiagramParams,
} from '~/utils/project/get-diagram-params'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { ReferenceList } from './reference-list'
import { RiskList, type TechnologyRisk } from './risk-list'
import { type ProjectSectionProps } from './types'

export interface MarkdownSectionProps extends ProjectSectionProps {
  diagram?: {
    type: DiagramType
    slug: string
  }
  content: string
  mdClassName?: string
  risks?: TechnologyRisk[]
  references?: ScalingProjectReference[]
}

export function MarkdownSection({
  diagram,
  content,
  mdClassName,
  risks,
  references,
  ...projectSectionProps
}: MarkdownSectionProps) {
  const diagramParams = diagram
    ? getDiagramParams(diagram.type, diagram.slug)
    : undefined

  return (
    <ProjectSection {...projectSectionProps}>
      {diagramParams ? (
        <figure className="mb-8 mt-4 text-center">
          <DiagramImage diagram={diagramParams} />
          <figcaption className="text-secondary text-xs">
            {diagramParams.caption}
          </figcaption>
        </figure>
      ) : null}
      <Markdown className={mdClassName}>{content}</Markdown>
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
      {references && references?.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
