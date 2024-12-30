"use client";

import { NextURL } from "next/dist/server/web/next-url";
import { useState } from "react";
import ShareMenu from "./shareMenu";
import Map from "./map";

export default function ShareMap() {
  const [url, setUrl] = useState<NextURL | undefined>();

  return (
    <div className="px-10 touch-none select-none overflow-hidden">
      <Map setUrl={setUrl} />
      <ShareMenu url={url} />
    </div>
  );
}
