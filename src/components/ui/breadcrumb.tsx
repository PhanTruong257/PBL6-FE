import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    title: string
    href: string
    isLink?: boolean
  }[]
  separator?: React.ReactNode
  isLastCurrent?: boolean
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ segments, separator = <ChevronRight className="h-4 w-4" />, isLastCurrent = true, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex items-center text-sm text-muted-foreground", className)}
        {...props}
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {segments.map((segment, index) => {
            const isLastItem = index === segments.length - 1
            const isCurrentPage = isLastItem && isLastCurrent

            return (
              <li key={segment.href} className="flex items-center gap-1.5">
                {segment.isLink === false ? (
                  <span
                    className={cn(
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      isCurrentPage ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {segment.title}
                  </span>
                ) : (
                  <Link
                    to={segment.href}
                    className={cn(
                      "overflow-hidden text-ellipsis whitespace-nowrap transition-colors hover:text-foreground",
                      isCurrentPage ? "text-foreground font-medium pointer-events-none" : "text-muted-foreground"
                    )}
                  >
                    {segment.title}
                  </Link>
                )}

                {!isLastItem && separator && (
                  <span className="text-muted-foreground">{separator}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }