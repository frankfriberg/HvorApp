"use client";

import { ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { NextURL } from "next/dist/server/web/next-url";

type ShareMenuProps = {
  url?: NextURL;
};

export default function ShareMenu({ url }: ShareMenuProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Her sitter jeg!",
          url: url?.href,
        })
        .catch(() => null);
    } else {
      console.warn("Web Share API is not supported in this environment.");
    }
  };

  return (
    <Button
      className={cn(
        "absolute -right-[25vw] bottom-[10vw] size-20 rounded-full transition-[right]",
        url && "right-[10vw]",
      )}
      onClick={handleShare}
    >
      <ShareIcon className="!size-7" />
    </Button>
  );
}
