import { TripEdit } from "@/components/trips/TripEdit";
import { Prop } from "@/lib/types";
import { Suspense } from "react";

async function TripEditContent({ params }: Prop) {
  const { id } = await params;

  return <TripEdit id={id} />;
}

export default function Page({ params }: Prop) {
  return (
    <main>
      <Suspense fallback={<p>旅行ページを読み込んでいます...</p>}>
        <TripEditContent params={params} />
      </Suspense>
    </main>
  );
}