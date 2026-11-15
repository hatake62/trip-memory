import { ItineraryEdit } from "@/components/itinerary/ItineraryEdit";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ItineraryFormStatus } from "@/components/itinerary/ItineraryFormLayout";

export const metadata: Metadata = { title: "予定を編集" };

type ItineraryProp = {
    params: Promise<{id: string, itemId: string}>;
};

async function ItineraryEditContent({ params }: ItineraryProp) {
  const { id, itemId } = await params;

  return <ItineraryEdit tripId={id} itemId={itemId} />;
}

export default function Page({ params }: ItineraryProp) {
  return (
    <main id="main-content" className="page-shell max-w-3xl py-8 sm:py-12">
      <Suspense fallback={<ItineraryFormStatus>ページを読み込んでいます...</ItineraryFormStatus>}>
        <ItineraryEditContent params={params} />
      </Suspense>
    </main>
  );
}
