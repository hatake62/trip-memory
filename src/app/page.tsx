import TripList from "@/components/trips/TripList";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <main>
        <Suspense fallback={<p>旅行を読み込み中...</p>}>
            <TripList />
        </Suspense>
      </main>
    </div>
  );
}
