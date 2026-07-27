import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getFacilityDetail,
  getFacilitySlugs,
} from "@/src/composition-root";
import { FacilityDetail } from "@/src/modules/facility/presentation/FacilityDetail";

interface FacilityPageProps {
  readonly params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getFacilitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FacilityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacilityDetail(slug);

  if (!facility) {
    return { title: "ページが見つかりません" };
  }

  return {
    title: facility.name,
    description: facility.summary,
  };
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { slug } = await params;
  const facility = await getFacilityDetail(slug);

  if (!facility) {
    notFound();
  }

  return <FacilityDetail facility={facility} />;
}
