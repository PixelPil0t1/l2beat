import { CloseIcon } from '~/icons/close'
import { StopwatchIcon } from '~/icons/stopwatch'
import { type ProjectCountdownsWithContext } from '~/server/features/scaling/utils/get-countdowns'
import { Callout } from '../../callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { Countdown } from '../../countdown'

type Props = NonNullable<ProjectCountdownsWithContext['otherMigration']>
export function OtherMigrationTooltip({
  expiresAt,
  pretendingToBe,
  reasons,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="relative -top-px">
        <StopwatchIcon className="size-3.5 md:size-4" />
      </TooltipTrigger>
      <TooltipContent className="space-y-2">
        <p className="text-primary text-lg font-bold leading-none">
          Recategorisation
        </p>
        <p className="text-[13px]">The project will be moved to Others in:</p>
        <Countdown
          expiresAt={expiresAt}
          size="sm"
          className="mx-auto w-full"
          withBackground
        />
        <p className="mt-4! text-primary text-base font-bold leading-none">
          Reasons
        </p>
        <p className="text-[13px]">
          The project will no longer be considered{' '}
          {pretendingToBe.startsWith('O') ? 'an' : 'a'} {pretendingToBe}{' '}
          because:
        </p>
        {reasons.map((reason) => {
          return (
            <Callout
              key={reason.label}
              color="red"
              body={reason.shortDescription}
              className="text-primary px-4 py-2 text-xs font-bold"
              icon={<CloseIcon className="fill-negative mt-1 size-3" />}
            />
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}
