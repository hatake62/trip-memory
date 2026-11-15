import { ItineraryEdit } from "@/components/itinerary/ItineraryEdit";
import { Suspense } from "react";

type ItineraryProp = {
    params: Promise<{id: string, itemId: string}>;
};

async function ItineraryEditContent({ params }: ItineraryProp) {
  const { id, itemId } = await params;

  return <ItineraryEdit tripId={id} itemId={itemId} />;
}

export default function Page({ params }: ItineraryProp) {
  return (
    <main>
      <Suspense fallback={<p>旅行ページを読み込んでいます...</p>}>
        <ItineraryEditContent params={params} />
      </Suspense>
    </main>
  );
}