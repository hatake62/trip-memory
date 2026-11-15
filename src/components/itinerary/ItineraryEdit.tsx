'use client';

import { getItineraryItems } from "@/lib/itinerary-storage";
import { getSavedTrips, getTripById } from "@/lib/trip-storage";
import type { ItineraryItem, Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { ItineraryForm } from "./ItineraryForm";
import { ItineraryFormLayout, ItineraryFormStatus } from "./ItineraryFormLayout";

export function ItineraryEdit({tripId, itemId}: {tripId: string, itemId: string}) {
    const [ tripData, setTripData ] = useState<Trip | undefined>();
    const [ itemData, setItemData ] = useState<ItineraryItem | undefined>()
    const [ error, setError ] = useState("");
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const trip = getTripById(tripId);
                setTripData(trip);
                const isSavedTrip = getSavedTrips().some(trip => trip.id === tripId);
                setCanEdit(isSavedTrip);
                if(trip === undefined) {
                    return;
                }
                if (!isSavedTrip) return;
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

    return (
        <ItineraryFormLayout mode="edit" tripId={tripId} trip={tripData}>
            {isLoading ? (
                <ItineraryFormStatus>旅行情報を読み込んでいます...</ItineraryFormStatus>
            ) : error ? (
                <ItineraryFormStatus isError>{error}</ItineraryFormStatus>
            ) : !tripData ? (
                <ItineraryFormStatus>旅行が見つかりませんでした</ItineraryFormStatus>
            ) : !canEdit ? (
                <ItineraryFormStatus>この旅行は閲覧専用のため、予定を編集できません。</ItineraryFormStatus>
            ) : !itemData ? (
                <ItineraryFormStatus>スケジュールが見つかりませんでした</ItineraryFormStatus>
            ) : (
                <ItineraryForm key={itemData.id} mode="edit" trip={tripData} item={itemData} />
            )}
        </ItineraryFormLayout>
    );
}
