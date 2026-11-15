'use client';

import { getItineraryItems } from "@/lib/itinerary-storage";
import { getTripDates } from "@/lib/itinerary-dates";
import type { ItineraryItem } from "@/lib/types";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { ItineraryItemCard } from "./ItineraryItemCard";

type ItineraryListProps = {
    tripId: string;
    startDate: string;
    endDate: string;
    canEdit: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
});

export function ItineraryList({ tripId, startDate, endDate, canEdit }: ItineraryListProps) {
    const [schedules, setSchedules] = useState<ItineraryItem[]>();
    const [loadError, setLoadError] = useState("");
    const [dayIndex, setDayIndex] = useState(0);
    const dates = useMemo(() => getTripDates(startDate, endDate), [startDate, endDate]);
    const selectedDate = dates[dayIndex];
    const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const data = getItineraryItems(tripId);
                setSchedules(data);
            } catch (err) {
                console.error(err);
                setLoadError("スケジュールの読み込みに失敗しました");
            }
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [tripId]);

    const dailySchedules = (schedules ?? [])
        .filter(item => item.tripId === tripId && item.date === selectedDate)
        .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
    const dateLabel = selectedDate
        ? dateFormatter.format(new Date(`${selectedDate}T00:00:00Z`)).replace("(", "（").replace(")", "）")
        : "";

    function changeDay(direction: number) {
        setDayIndex(current => Math.max(0, Math.min(dates.length - 1, current + direction)));
    }

    function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
        touchStart.current = null;
        if (event.touches.length !== 1) return;
        // ボタンやリンクのタップと日付切り替えが競合しないようにする。
        if (event.target instanceof Element && event.target.closest("a, button")) return;
        const touch = event.touches[0];
        touchStart.current = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
    }

    function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
        const start = touchStart.current;
        if (!start) return;
        const touch = event.touches[0];
        if (event.touches.length !== 1 || touch.identifier !== start.id) {
            touchStart.current = null;
            return;
        }
        const dx = Math.abs(touch.clientX - start.x);
        const dy = Math.abs(touch.clientY - start.y);
        // 縦スクロールとして始まった操作は、その後もスワイプとして扱わない。
        if (dy >= 10 && dy >= dx) touchStart.current = null;
    }

    function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || event.touches.length !== 0) return;
        const touch = Array.from(event.changedTouches).find(touch => touch.identifier === start.id);
        if (!touch) return;
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            changeDay(dx < 0 ? 1 : -1);
        }
    }

    return (
        <section aria-labelledby="itinerary-heading" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <h2 id="itinerary-heading" className="text-xl font-bold">旅行スケジュール</h2>
                {!canEdit && <span className="rounded-full bg-sage px-3 py-1 text-xs text-muted">閲覧専用</span>}
            </div>
            {loadError ? (
                <p role="alert" className="text-sm text-red-700">{loadError}</p>
            ) : schedules === undefined ? (
                <p role="status" className="text-sm text-muted">スケジュールを読み込んでいます...</p>
            ) : !selectedDate ? (
                <p role="alert" className="text-sm text-red-700">旅行期間の日付を確認してください</p>
            ) : (
                <div
                    className="touch-pan-y touch-pinch-zoom"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={() => { touchStart.current = null; }}
                >
                    <nav aria-label="スケジュールの日付切り替え" className="mb-6 border-b border-line pb-6">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                aria-label="前の日の予定を表示"
                                aria-controls="itinerary-day"
                                disabled={dayIndex === 0}
                                onClick={() => changeDay(-1)}
                                className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line text-forest enabled:hover:bg-sage disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <Icon name="arrow" />
                            </button>
                            <div aria-live="polite" aria-atomic="true" className="text-center">
                                <h3 id="itinerary-date-heading" className="text-lg font-bold">{dayIndex + 1}日目</h3>
                                <p className="mt-1 text-sm text-muted"><time dateTime={selectedDate}>{dateLabel}</time></p>
                                <p className="sr-only">全{dates.length}日間</p>
                            </div>
                            <button
                                type="button"
                                aria-label="次の日の予定を表示"
                                aria-controls="itinerary-day"
                                disabled={dayIndex === dates.length - 1}
                                onClick={() => changeDay(1)}
                                className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line text-forest enabled:hover:bg-sage disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <Icon name="arrow" className="rotate-180" />
                            </button>
                        </div>
                        <div aria-hidden="true" className="mt-5 flex flex-wrap justify-center gap-2">
                            {dates.map((date, index) => (
                                <span key={date} className={`h-2 rounded-full ${index === dayIndex ? "w-6 bg-forest" : "w-2 bg-line"}`} />
                            ))}
                        </div>
                        <p className="mt-3 text-center text-xs text-muted">矢印や左右のスワイプで日付を切り替え</p>
                    </nav>
                    <section id="itinerary-day" aria-labelledby="itinerary-date-heading" className="min-h-28">
                        {dailySchedules.length === 0 ? (
                            <p role="status" className="py-8 text-center text-sm text-muted">この日の予定はまだありません</p>
                        ) : (
                            <ol>
                                {dailySchedules.map((item, index) => (
                                    <ItineraryItemCard
                                        key={item.id}
                                        item={item}
                                        isLast={index === dailySchedules.length - 1}
                                        canEdit={canEdit}
                                        onDeleted={(deletedId) => {
                                            setSchedules(prev => prev?.filter(item => item.id !== deletedId));
                                        }}
                                    />
                                ))}
                            </ol>
                        )}
                        {canEdit && (
                            <div className="mt-5 sm:ml-14">
                                <Link
                                    href={{ pathname: `/trips/${tripId}/itinerary/new`, query: { date: selectedDate } }}
                                    className="button-secondary w-full sm:w-auto"
                                    aria-label={`${dateLabel}に予定を追加`}
                                >
                                    <Icon name="plus" />
                                    この日に予定を追加
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </section>
    );
}
