'use client';

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import { deleteSavedTrip, getSavedTrips, getTripById } from "@/lib/trip-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ItineraryList } from "../itinerary/ItineraryList";

export function TripDetail({ id }: { id: string }) {
    return <TripDetailContent key={id} id={id} />;
}

function TripDetailContent({ id }: { id: string }) {
    const [tripData, setTripData] = useState<Trip | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [canEdit, setCanEdit] = useState(false);
    const [ deleteError, setDeleteError ] = useState("");
    const router = useRouter();

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const loadeddata = getTripById(id);
                setTripData(loadeddata);
                setCanEdit(getSavedTrips().some(trip => trip.id === id));
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

    function handleDelete() {
        if (!canEdit) return;

        const confirmed = window.confirm(
            "この旅行を削除しますか？この操作は取り消せません"
        );

        if(!confirmed) {
            return;
        }

        try {
            const result = deleteSavedTrip(id);

            if(!result) {
                setDeleteError("削除対象の旅行が見つかりませんでした");
                return;
            }

            router.push("/");
        } catch(err) {
            console.error(err);
            setDeleteError("旅行の削除に失敗しました");
        }
    }

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
        <div className="page-shell max-w-3xl py-8 sm:py-12">
            <header className="mb-8 space-y-3">
                <h1 className="break-words text-2xl font-bold sm:text-3xl">{tripData.title}</h1>
                <p className="break-words text-sm text-muted">{tripData.destination}</p>
                <p className="text-sm text-muted">{tripData.startDate} 〜 {tripData.endDate}</p>
                {tripData.memo && <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted">{tripData.memo}</p>}
            </header>
            <ItineraryList
                key={`${tripData.id}:${tripData.startDate}:${tripData.endDate}`}
                tripId={tripData.id}
                startDate={tripData.startDate}
                endDate={tripData.endDate}
                canEdit={canEdit}
            />
            {canEdit && <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/trips/${id}/edit`} className="button-secondary">
                    旅行を編集
                </Link>
                <button type="button" onClick={handleDelete} className="min-h-12 rounded-xl px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-50">
                    旅行を削除
                </button>
            </div>}
            {deleteError && (
                <p role="alert" className="mt-3 text-sm text-red-700">{deleteError}</p>
            )}
        </div>
    )
}
