'use client';

import { getPackingItems } from "@/lib/packing-storage";
import { getSavedTrips, getTripById } from "@/lib/trip-storage";
import type { PackingItem, Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingForm } from "./PackingForm";
import { PackingFormLayout, PackingFormStatus } from "./PackingFormLayout";

type PackingEditProps = {
    tripId: string;
    itemId: string;
};

export function PackingEdit({ tripId, itemId }: PackingEditProps) {
    return <PackingEditContent key={`${tripId}:${itemId}`} tripId={tripId} itemId={itemId} />;
}

function PackingEditContent({ tripId, itemId }: PackingEditProps) {
    const [trip, setTrip] = useState<Trip>();
    const [item, setItem] = useState<PackingItem>();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadedTrip = getTripById(tripId);
                const isSavedTrip = getSavedTrips().some(trip => trip.id === tripId);
                setTrip(loadedTrip);
                setCanEdit(isSavedTrip);
                setError("");
                setItem(loadedTrip && isSavedTrip
                    ? getPackingItems(tripId).find(item => item.id === itemId)
                    : undefined);
            } catch (err) {
                console.error(err);
                setError("持ち物データの取得に失敗しました。時間をおいて、もう一度お試しください");
            } finally {
                setIsLoading(false);
            }
        }, 0);
        return () => window.clearTimeout(timerId);
    }, [tripId, itemId]);

    return (
        <PackingFormLayout mode="edit" tripId={tripId} trip={trip}>
            {isLoading ? (
                <PackingFormStatus>持ち物を読み込んでいます...</PackingFormStatus>
            ) : error ? (
                <PackingFormStatus isError>{error}</PackingFormStatus>
            ) : !trip ? (
                <PackingFormStatus>旅行が見つかりませんでした</PackingFormStatus>
            ) : !canEdit ? (
                <PackingFormStatus>この旅行は閲覧専用のため、持ち物を編集できません。</PackingFormStatus>
            ) : !item ? (
                <PackingFormStatus>持ち物が見つかりませんでした</PackingFormStatus>
            ) : (
                <PackingForm key={`${item.id}:${item.name}`} mode="edit" trip={trip} item={item} />
            )}
        </PackingFormLayout>
    );
}
