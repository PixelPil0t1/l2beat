import { CustomLink } from '~/components/link/custom-link'
import { DownloadArrowIcon } from '~/icons/download-arrow'
import { cn } from '~/utils/cn'

interface ReportDownloadButtonProps {
  fileUrl: string
  className?: string
}

export function ReportDownloadButton({
  fileUrl,
  className,
}: ReportDownloadButtonProps) {
  return (
    <CustomLink
      className={cn(
        'bg-brand flex items-center justify-center rounded-md py-4 text-white no-underline transition-colors hover:bg-pink-800 hover:text-white md:w-1/3 md:py-5 dark:text-white dark:hover:text-white',
        className,
      )}
      href={fileUrl}
    >
      <DownloadArrowIcon className="mr-3" />
      Download the report
    </CustomLink>
  )
}
