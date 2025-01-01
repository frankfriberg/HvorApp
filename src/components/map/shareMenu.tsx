"use client";

import { ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { NextURL } from "next/dist/server/web/next-url";

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
        "rounded-full size-20 absolute bottom-[10vw] -right-[25vw] transition-[right]",
        url && "right-[10vw]",
      )}
      onClick={handleShare}
    >
      <ShareIcon className="!size-7" />
    </Button>
  );
}
