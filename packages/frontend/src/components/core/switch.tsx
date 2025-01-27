'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'
import { useTracking } from '~/hooks/use-custom-event'
import { cn } from '~/utils/cn'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root> & { name: string }) {
  const { track } = useTracking()
  return (
    <SwitchPrimitives.Root
      className={cn(
        'shadow-xs focus-visible:outline-hidden focus-visible:ring-brand focus-visible:ring-offset-background data-[state=checked]:bg-brand data-[state=unchecked]:bg-surface-tertiary peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
      onCheckedChange={(checked) => {
        props.onCheckedChange?.(checked)
        track('switchChanged', {
          props: {
            name: props.name,
            value: checked.toString(),
          },
        })
      }}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-primary-invert pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitives.Root>
  )
}

export { Switch }
