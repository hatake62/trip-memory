"use client";

import type { FilterStatus, TripFilterProps } from "@/lib/types";

const allStatus: FilterStatus[] = [
    "all",
    "past",
    "ongoing",
    "upcoming"
] ;

export function TripFilter({status, setStatus}: TripFilterProps) {
    return (
        <>
        <div className="grid grid-cols-4 m-3">
            {allStatus.map((nowStatus) => (
                <button aria-pressed={status === nowStatus} type="button" className={`p-1 rounded-xl  ${
                    status === nowStatus ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                }`} key={nowStatus} onClick={() => setStatus(nowStatus)}>
                    {nowStatus}
                </button>
            ))}
        </div>
        </>
    )
}