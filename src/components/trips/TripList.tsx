"use client";

import type { FilterStatus, Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { TripFilter } from "./TripFilter";
import { mockData } from "@/lib/mock-data";
import { getTripStatus } from "@/lib/trip-utils";
import TripCard from "./TripCard";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { getSavedTrips } from "@/lib/trip-storage";

export default function TripList() {
  const [ loadError, setLoadError ] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [ tripData, setTripData ] = useState<Trip[]>(mockData);
  const filteredTrip = tripData
  .filter(trip => status === "all" ? true : getTripStatus(trip) === status)
  .sort((a, b) => Number(a.startDate.replaceAll('-', '')) - Number(b.startDate.replaceAll('-', '')));

  useEffect(() => {
    const timerId = setTimeout(() => {
      try {
        const savedTrips = getSavedTrips();
        setTripData([...mockData, ...savedTrips]);
      } catch(err) {
        console.error(err);
        setLoadError("保存した旅行を読み込めませんでした");
      }
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  function handleStatus(nowStatus: FilterStatus) {
    setStatus(nowStatus);
  }

  return (
    <section aria-label="旅行の一覧">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <TripFilter status={status} setStatus={handleStatus} />
        <p role="status" className="text-sm text-muted"><span className="mr-1 font-semibold text-foreground">{filteredTrip.length}</span>件の旅行</p>
      </div>
      {loadError && (
                    <p id="trip-form-error" role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                        {loadError}
                    </p>
                )}
      {filteredTrip.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrip.map(trip => <TripCard trip={trip} key={trip.id} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white px-5 py-14 text-center">
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-sage text-forest"><Icon name="book" className="size-6" /></span>
          <h2 className="text-lg font-semibold">{tripData.length === 0 ? "最初の旅を、ここから。" : "このステータスの旅行はまだありません"}</h2>
          <p className="mx-auto mb-6 mt-3 max-w-sm text-sm leading-7 text-muted">{tripData.length === 0 ? "行きたい場所が決まったら、旅行の情報を入力してみましょう。" : "ほかのステータスに切り替えると、登録されている旅行を確認できます。"}</p>
          {tripData.length === 0 ? <Link href="/trips/new" className="button-primary"><Icon name="plus" />新しい旅行を作成</Link> : <button type="button" className="button-secondary" onClick={() => setStatus("all")}>すべての旅行を表示</button>}
        </div>
      )}
    </section>
  );
}
