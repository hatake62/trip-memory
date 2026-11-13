"use client";

import type { FilterStatus, TripFilterProps } from "@/lib/types";
import { statusLabels } from "@/lib/trip-presentation";

const allStatus: FilterStatus[] = ["all", "past", "ongoing", "upcoming"];

export function TripFilter({ status, setStatus }: TripFilterProps) {
  return (
    <div role="group" aria-label="旅行のステータスで絞り込み" className="grid grid-cols-4 gap-1 rounded-xl border border-line bg-[#eef1eb] p-1 sm:inline-grid">
      {allStatus.map((nowStatus) => (
        <button
          aria-pressed={status === nowStatus}
          type="button"
          className={`min-h-11 rounded-lg px-1 text-xs font-medium sm:px-5 sm:text-sm ${status === nowStatus ? "bg-white text-forest shadow-sm" : "text-muted hover:bg-white/60 hover:text-forest"}`}
          key={nowStatus}
          onClick={() => setStatus(nowStatus)}
        >
          {statusLabels[nowStatus]}
        </button>
      ))}
    </div>
  );
}
