import React from "react"

import { Badge } from "./badge"
import { cn } from "../lib/utils"

interface TagBadgeProps {
  tag: string
  variant?: "default" | "secondary" | "outline"
  className?: string
}

export function TagBadge({ tag, variant = "secondary", className }: TagBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn("text-xs font-medium hover:bg-secondary/80 cursor-pointer transition-colors", className)}
    >
      #{tag}
    </Badge>
  )
}
