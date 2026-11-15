'use client';

import { getItineraryItems } from "@/lib/itinerary-storage";
import { getTripById } from "@/lib/trip-storage";
import { ItineraryItem, Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { ItineraryForm } from "./ItineraryForm";

export function ItineraryEdit({tripId, itemId}: {tripId: string, itemId: string}) {
    const [ tripData, setTripData ] = useState<Trip | undefined>();
    const [ itemData, setItemData ] = useState<ItineraryItem | undefined>()
    const [ error, setError ] = useState("");
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const trip = getTripById(tripId);
                setTripData(trip);
                if(trip === undefined) {
                    return;
                }
                const item = getItineraryItems(trip.id);
                setItemData(item.find(i => i.id === itemId));
            } catch(err) {
                console.error(err);
                setError("スケジュールデータの取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [itemId, tripId]);

    if (isLoading) {
        return <p>旅行情報を読み込んでいます...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }
    
    if(!tripData) {
        return <p>旅行が見つかりませんでした</p>
    }

    if (!itemData) {
        return <p>スケジュールが見つかりませんでした</p>;
    }

    return <ItineraryForm 
                mode="edit"
                trip={tripData}
                item={itemData}
            />
}