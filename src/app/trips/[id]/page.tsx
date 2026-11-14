
import { Suspense } from "react";
import { TripDetail } from "@/components/trips/TripDetail";
import type { Prop } from "@/lib/types";

async function TripDetailContent({ params }: Prop) {
  const { id } = await params;

  return <TripDetail id={id} />;
}

export default function Page({ params }: Prop) {
  return (
    <main>
      <Suspense fallback={<p>旅行ページを読み込んでいます...</p>}>
        <TripDetailContent params={params} />
      </Suspense>
    </main>
  );
}
