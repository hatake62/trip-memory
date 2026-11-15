'use client';

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import { getTripById } from "@/lib/trip-storage";
import { ItineraryForm } from "./ItineraryForm";

type ItineraryCreateProps = {
    id: string;
};

export function ItineraryCreate({id}: ItineraryCreateProps) {
    const [trip, setTrip] = useState<Trip | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadedData = getTripById(id);
                setTrip(loadedData);
            } catch(err) {
                console.error(err);
                setError("旅行データを読み込めませんでした");
            } finally {
                setIsLoading(false);
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [id]);

    if (isLoading) {
            return <p>旅行情報を読み込んでいます...</p>;
        }
    
    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (!trip) {
        return <p>旅行が見つかりませんでした</p>;
    }
    
    return <ItineraryForm  
                trip={trip} 
                mode="create"
            />;
}