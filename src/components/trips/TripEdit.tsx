'use client';

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import { getSavedTrips } from "@/lib/trip-storage";
import { TripForm } from "./TripForm";

export function TripEdit({id}: {id: string}) {
    const [tripData, setTripData] = useState<Trip | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadedData = getSavedTrips();
                const trip = loadedData.find(trip => trip.id === id);
                setTripData(trip);
            } catch(err) {
                console.error(err);
                setError("旅行データを読み込めませんでした");
            } finally {
                setIsLoading(false);
            }
        }, 0);

        return () => {
            window.clearTimeout(timerId);
        }
    },[id]);
    
    if (isLoading) {
        return <p>旅行情報を読み込んでいます...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }
    
    if (!tripData) {
        return <p>旅行が見つかりませんでした</p>;
    }

    return <TripForm mode="edit" trip={tripData}/>;
}