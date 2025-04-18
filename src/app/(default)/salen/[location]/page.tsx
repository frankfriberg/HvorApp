import ShareMap from "@/components/map/shareMap";
import type { Position } from "@/components/map/touchMap";
import { list } from "@vercel/blob";
import type { Metadata } from "next";
import Image from "next/image";

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

const locations = await list({ prefix: "salen" });

export async function generateStaticParams() {
  const filteredLocations = locations.blobs.filter(({ size }) => size > 0);
  const locationsMap = filteredLocations.map(({ pathname }) => {
    const segment = pathname.split("/")[1];
    const locationName = segment.includes(".")
      ? segment.substring(0, segment.lastIndexOf("."))
      : segment;

    return {
      location: locationName,
    };
  });

  return locationsMap;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;

  const match = locations.blobs.find(({ pathname }) =>
    pathname.includes(location),
  );

  if (!match) return {};

  return {
    title: location,
    openGraph: {
      images: [match.url],
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const arena = "salen";

  const { blobs } = await list({ prefix: "maps" });
  const map = blobs.find((blob) => blob.pathname.startsWith(`maps/${arena}`));

  if (!map) return null;

  const points = extractCoordinates(location);

  if (!points) return null;

  return <ShareMap arena="salen" map={map.downloadUrl} points={points} />;
}
