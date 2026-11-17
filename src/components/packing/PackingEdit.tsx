'use client';

import { getPackingItems } from "@/lib/packing-storage";
import { getSavedTrips} from "@/lib/trip-storage";
import { PackingItem, Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingForm } from "./PackingForm";

type PackingEditProps = {
    tripId: string;
    itemId: string;
}

export function PackingEdit(
    {tripId, itemId}: PackingEditProps
) {
    const [ tripData, setTripData ] = useState<Trip | undefined>();
    const [ itemData, setItemData ] = useState<PackingItem | undefined>();
    const [ error, setError ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);


    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const trip = getSavedTrips().find(trip => 
                    trip.id === tripId
                );
                setTripData(trip);
                const item = getPackingItems(tripId).find(item => 
                    item.id === itemId
                );
                setItemData(item);
            } catch(err) {
                console.error(err);
                setError("持ち物データの取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        }, 0);
        return () => window.clearTimeout(timerId);
    }, [tripId, itemId]);

    if(error) {
        return <p role="alert">{error}</p>
    }

    if(isLoading){
        return <p>旅行情報を読み込み中...</p>
    }

    if(!tripData) {
        return <p>旅行が見つかりませんでした</p>
    }

    if(!itemData) {
        return <p>持ち物が見つかりませんでした</p>
    }

    return (
        <PackingForm mode="edit" trip={tripData} item={itemData} />
    )


}