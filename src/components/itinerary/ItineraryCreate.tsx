'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Trip } from "@/lib/types";
import { getSavedTrips, getTripById } from "@/lib/trip-storage";
import { ItineraryForm } from "./ItineraryForm";
import { ItineraryFormLayout, ItineraryFormStatus } from "./ItineraryFormLayout";

type ItineraryCreateProps = {
    id: string;
};

export function ItineraryCreate({id}: ItineraryCreateProps) {
    const [trip, setTrip] = useState<Trip | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [canEdit, setCanEdit] = useState(false);
    const searchParams = useSearchParams();
    const initialDate = searchParams.get("date") ?? undefined;

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadedData = getTripById(id);
                setTrip(loadedData);
                setCanEdit(getSavedTrips().some(trip => trip.id === id));
            } catch(err) {
                console.error(err);
                setError("旅行データを読み込めませんでした");
            } finally {
                setIsLoading(false);
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [id]);

    return (
        <ItineraryFormLayout mode="create" tripId={id} trip={trip}>
            {isLoading ? (
                <ItineraryFormStatus>旅行情報を読み込んでいます...</ItineraryFormStatus>
            ) : error ? (
                <ItineraryFormStatus isError>{error}</ItineraryFormStatus>
            ) : !trip ? (
                <ItineraryFormStatus>旅行が見つかりませんでした</ItineraryFormStatus>
            ) : !canEdit ? (
                <ItineraryFormStatus>この旅行は閲覧専用のため、予定を追加できません。</ItineraryFormStatus>
            ) : (
                <ItineraryForm key={`${trip.id}:${initialDate ?? ""}`} trip={trip} mode="create" initialDate={initialDate} />
            )}
        </ItineraryFormLayout>
    );
}
