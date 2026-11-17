'use client';

import { getSavedTrips, getTripById } from "@/lib/trip-storage";
import type { Trip } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingForm } from "./PackingForm";
import { PackingFormLayout, PackingFormStatus } from "./PackingFormLayout";

export function PackingCreate({ id }: { id: string }) {
    return <PackingCreateContent key={id} id={id} />;
}

function PackingCreateContent({ id }: { id: string }) {
    const [trip, setTrip] = useState<Trip>();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                setTrip(getTripById(id));
                setCanEdit(getSavedTrips().some(trip => trip.id === id));
                setError("");
            } catch (err) {
                console.error(err);
                setError("旅行情報の取得に失敗しました。時間をおいて、もう一度お試しください");
            } finally {
                setIsLoading(false);
            }
        }, 0);
        return () => window.clearTimeout(timerId);
    }, [id]);

    return (
        <PackingFormLayout mode="create" tripId={id} trip={trip}>
            {isLoading ? (
                <PackingFormStatus>旅行情報を読み込んでいます...</PackingFormStatus>
            ) : error ? (
                <PackingFormStatus isError>{error}</PackingFormStatus>
            ) : !trip ? (
                <PackingFormStatus>旅行が見つかりませんでした</PackingFormStatus>
            ) : !canEdit ? (
                <PackingFormStatus>この旅行は閲覧専用のため、持ち物を追加できません。</PackingFormStatus>
            ) : (
                <PackingForm trip={trip} mode="create" />
            )}
        </PackingFormLayout>
    );
}
