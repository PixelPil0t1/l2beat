import { type ReactNode } from 'react'
import { cn } from '~/utils/cn'

interface IndexCellProps {
  children: ReactNode
  className?: string
}

export function IndexCell({ children, className }: IndexCellProps) {
  return (
    <div
      className={cn(
        'dark:text-n-zinc-300 ml-auto text-right text-xs font-medium tabular-nums text-zinc-500 dark:font-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
