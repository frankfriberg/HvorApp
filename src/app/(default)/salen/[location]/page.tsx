import { list } from "@vercel/blob";
import type { Metadata } from "next";
import Image from "next/image";

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

  const match = locations.blobs.find(({ pathname }) =>
    pathname.includes(location),
  );

  if (!match) return null;

  return <Image src={match.url} alt={match.pathname} />;
}
