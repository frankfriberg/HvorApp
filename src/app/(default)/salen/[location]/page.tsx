import { readdir } from "node:fs/promises";
import ShareMap from "@/components/map/shareMap";
import type { Position } from "@/components/map/touchMap";
import Salen from "@public/arena/salen.svg";
import type { Metadata } from "next";

function extractCoordinates(input: string): Position | null {
  const regex = /^Y(\d+)X(\d+)$/;
  const match = input.match(regex);

  if (match) {
    const y = Number.parseInt(match[1], 10);
    const x = Number.parseInt(match[2], 10);
    return { x, y };
  }

  return null;
}

type Props = {
  params: Promise<{ location: string }>;
};

export async function generateStaticParams() {
  const files = await readdir("./public/salen");
  const locationsMap = files.map((file) => {
    const locationName = file.includes(".")
      ? file.substring(0, file.lastIndexOf("."))
      : file;

    return {
      location: locationName,
    };
  });

  return locationsMap;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;

  return {
    title: location,
    openGraph: {
      images: `https://${process.env.BLOB_URL}/salen/${location}.png`,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;

  const points = extractCoordinates(location);

  if (!points) return null;

  return <ShareMap arena="salen" map={Salen} points={points} />;
}
