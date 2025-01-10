import { list } from "@vercel/blob";
import { Metadata } from "next";

type Props = {
  params: Promise<{ location: string }>;
};

const locations = await list({ prefix: "salen" });

export async function generateStaticParams() {
  const filteredLocations = locations.blobs.filter(({ size }) => size > 0);
  const locationsMap = filteredLocations.map(({ pathname }) => ({
    location: pathname.split("/")[1].split(".")[0],
  }));

  return locationsMap;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = (await params).location;

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

export default async function LocationPage() {}
