import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'

export function DetailsItem({
  title,
  children,
  className,
  tooltip,
}: {
  title: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="text-2xs text-secondary flex items-center gap-1.5 font-medium uppercase">
        {title}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-current md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="text-lg font-bold">{children}</div>
    </div>
  )
}
