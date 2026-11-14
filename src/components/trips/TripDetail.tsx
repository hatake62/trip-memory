'use client';

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import { getTripById } from "@/lib/trip-storage";

export function TripDetail({ id }: { id: string }) {
    const [tripData, setTripData] = useState<Trip | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsLoading(true);
        const timerId = setTimeout(() => {
            try {
                const loadeddata = getTripById(id);
                setTripData(loadeddata); 
            } catch(err) {
                console.error(err);
                setError("ホテルデータを読み込めませんでした");
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

    return (
        <div>
            
            {tripData !== undefined &&
            <>
                <h3>{tripData.title}</h3>
                <p>{tripData.destination}</p>
                <p>{tripData.startDate} ~ {tripData.endDate}</p>
                <p>{tripData.memo}</p>
            </>
            }
        </div>
    )
}