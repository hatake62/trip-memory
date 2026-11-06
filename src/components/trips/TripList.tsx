'use client'

import { FilterStatus } from "@/lib/types";
import { useState } from "react";
import { TripFilter } from "./TripFilter";
import { mockData } from "@/lib/mock-data";
import { getTripStatus } from "@/lib/trip-utils";
import TripCard from "./TripCard";

export default function TripList() {
    const [ status, setStatus ] = useState<FilterStatus>("all");
    const filteredTrip = mockData.filter(trip => status === "all" ? true : getTripStatus(trip) === status);

    function handleStatus(nowStatus: FilterStatus) {
        setStatus(nowStatus)
    }

    return (
        <div>
            <TripFilter 
                status={status}
                setStatus={handleStatus}
            />
            {filteredTrip.map(trip => (
                <TripCard trip={trip} key={trip.id}/>
            ))}
        </div>
    )
}