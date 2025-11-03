import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-white text-gray-700 border-gray-200 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
        secondary: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        destructive: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        outline: "bg-white text-gray-800 border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
