import { Suspense } from "react";
import type { Metadata } from "next";
import { ItineraryCreate } from "@/components/itinerary/ItineraryCreate";
import { ItineraryFormStatus } from "@/components/itinerary/ItineraryFormLayout";

export const metadata: Metadata = { title: "予定を追加" };

type Props = {
  params: Promise<{ id: string }>;
};

async function ItineraryCreateContent({ params }: Props) {
  const { id } = await params;

  return <ItineraryCreate id={id} />;
}

export default function Page({ params }: Props) {
  return (
    <main id="main-content" className="page-shell max-w-3xl py-8 sm:py-12">
      <Suspense fallback={<ItineraryFormStatus>ページを読み込んでいます...</ItineraryFormStatus>}>
        <ItineraryCreateContent params={params} />
      </Suspense>
    </main>
  );
}
