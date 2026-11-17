'use client';

import { getSavedTrips } from "@/lib/trip-storage";
import type { Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingForm } from "./PackingForm";

export function PackingCreate({id}: {id: string}) {
    const [ trip, setTrip ] = useState<Trip>();
    const [ error, setError ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadedTrip = getSavedTrips().find(
                    trip => trip.id === id
                );
                setTrip(loadedTrip);
            } catch(err) {
                console.error(err);
                setError("旅行情報の取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [id]);

    if(error) {
        return <p role="alert">{error}</p>
    }

    if(isLoading){
        return <p>旅行情報を読み込み中...</p>
    }

    if(!trip) {
        return <p>旅行が見つかりませんでした</p>
    }

    return <PackingForm trip={trip} mode="create"/>
}