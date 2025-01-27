import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { cn } from '~/utils/cn'

export function DetailsLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return (
    <LinkWithOnHoverPrefetch
      href={`/zk-catalog/${slug}`}
      className={cn(
        'text-primary-invert mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-black px-6 text-base font-bold md:mt-0 dark:bg-white',
        className,
      )}
    >
      <span className="max-md:hidden">Details</span>
      <span className="md:hidden">Details page</span>
    </LinkWithOnHoverPrefetch>
  )
}
