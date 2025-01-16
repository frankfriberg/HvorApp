"use client";

import { NextURL } from "next/dist/server/web/next-url";
import { useState } from "react";
import ShareMenu from "./shareMenu";
import Map from "./map";

type Props = {
  arena: string;
  map: string;
};

export default function ShareMap(props: Props) {
  const [url, setUrl] = useState<NextURL | undefined>();

  return (
    <div className="touch-none select-none px-10">
      <Map setUrl={setUrl} {...props} />
      <ShareMenu url={url} />
    </div>
  );
}
