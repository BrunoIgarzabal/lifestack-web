import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "../lib/utils";

interface AuthorBioProps {
  name: string;
  bio: string;
  avatar?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AuthorBio({
  name,
  bio,
  avatar,
  className,
  size = "md",
}: AuthorBioProps) {
  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={avatarSizes[size]}>
        <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-foreground", textSizes[size])}>
          {name}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
      </div>
    </div>
  );
}
