import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Trip } from "@/lib/types";

type ItineraryFormLayoutProps = {
    mode: "create" | "edit";
    tripId: string;
    trip?: Trip;
    children: ReactNode;
};

export function ItineraryFormLayout({ mode, tripId, trip, children }: ItineraryFormLayoutProps) {
    return (
        <>
            <header className="mb-8">
                <Link href={`/trips/${tripId}`} className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-muted hover:text-forest">
                    <Icon name="arrow" className="size-4" />
                    旅行詳細に戻る
                </Link>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {mode === "create" ? "予定を追加" : "予定を編集"}
                </h1>
                {trip && (
                    <div className="mt-4 space-y-2 text-sm text-muted">
                        <p className="break-words font-medium text-forest">{trip.title}</p>
                        <p className="flex items-start gap-2 leading-6">
                            <Icon name="calendar" className="mt-0.5 size-4 shrink-0" />
                            <span><time dateTime={trip.startDate}>{trip.startDate}</time> 〜 <time dateTime={trip.endDate}>{trip.endDate}</time></span>
                        </p>
                    </div>
                )}
            </header>
            {children}
        </>
    );
}

export function ItineraryFormStatus({ children, isError = false }: { children: ReactNode; isError?: boolean }) {
    return (
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <p role={isError ? "alert" : "status"} className={`text-sm leading-7 ${isError ? "text-red-800" : "text-muted"}`}>
                {children}
            </p>
        </div>
    );
}
