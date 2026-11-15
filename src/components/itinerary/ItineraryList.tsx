'use client';

import { getItineraryItems } from "@/lib/itinerary-storage";
import type { ItineraryItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { ItineraryItemCard } from "./ItineraryItemCard";

type ItineraryListProps = {
    tripId: string;
};

export function ItineraryList({tripId}: ItineraryListProps) {
    const [ schedules, setSchedules ] = useState<ItineraryItem[]>();
    const [ loadError, setLoadError ] = useState("");


    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const data = getItineraryItems(tripId);
                setSchedules(data);
            } catch(err) {
                console.error(err);
                setLoadError("スケジュールの読み込みに失敗しました");
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [tripId]);


    if (loadError) {
        return <p role="alert">{loadError}</p>;
    }

    if (schedules === undefined) {
        return <p>スケジュールを読み込んでいます...</p>;
    }

    if (schedules.length === 0) {
        return <p>まだ予定が登録されていません</p>;
    }


    return (
        <div>
            {schedules.map(schedule => (
                <ItineraryItemCard
                    key={schedule.id}
                    item={schedule}
                    onDeleted={(deletedId) => {
                        setSchedules(prev =>
                            prev?.filter(item => item.id !== deletedId)
                        );
                    }}
                />
            ))}
        </div>
    )
}