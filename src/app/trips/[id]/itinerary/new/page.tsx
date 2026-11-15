import { Suspense } from "react";
import { ItineraryCreate } from "@/components/itinerary/ItineraryCreate";

type Props = {
  params: Promise<{ id: string }>;
};

async function ItineraryCreateContent({ params }: Props) {
  const { id } = await params;

  return <ItineraryCreate id={id} />;
}

export default function Page({ params }: Props) {
  return (
    <main>
      <Suspense fallback={<p>ページを読み込んでいます...</p>}>
        <ItineraryCreateContent params={params} />
      </Suspense>
    </main>
  );
}
