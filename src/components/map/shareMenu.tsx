"use client";

import { ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { NextURL } from "next/dist/server/web/next-url";

type ShareMenuProps = {
  url?: NextURL;
};

export default function ShareMenu({ url }: ShareMenuProps) {
  return (
    <Button
      className={cn(
        "rounded-full size-20 absolute bottom-[10vw] -right-[25vw] transition-[right]",
        url && "right-[10vw]",
      )}
      onClick={() =>
        navigator.share({
          title: "Test",
          url: url?.href,
        })
      }
    >
      <ShareIcon className="!size-7" />
    </Button>
  );
}
