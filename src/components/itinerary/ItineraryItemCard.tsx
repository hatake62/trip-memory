'use client';

import { deleteItineraryItem } from "@/lib/itinerary-storage";
import type { ItineraryItem, ItineraryCategory } from "@/lib/types"
import Link from "next/link";
import { useState, type ComponentProps } from "react";
import Icon from "@/components/ui/Icon";

type ItineraryItemCardProps = {
  item: ItineraryItem;
  onDeleted: (id: string) => void;
  isLast: boolean;
  canEdit: boolean;
};

const categoryLabels: Record<ItineraryCategory, string> = {
  sightseeing: "観光",
  food: "食事",
  transport: "移動",
  hotel: "宿泊",
  other: "その他",
};

const categoryIcons = {
  sightseeing: "camera",
  food: "utensils",
  transport: "train",
  hotel: "bed",
  other: "calendar",
} as const satisfies Record<ItineraryCategory, ComponentProps<typeof Icon>["name"]>;

export function ItineraryItemCard({item, onDeleted, isLast, canEdit}: ItineraryItemCardProps) {
    const [ deleteError, setDeleteError ] = useState("");

    function handleDelete() {
        if (!canEdit) return;

        const confirmed = window.confirm(
            "このスケジュールを削除しますか？この操作は取り消せません"
        );
    
        if(!confirmed) {
            return;
        }
    
        try {
            const result = deleteItineraryItem(item.id);
    
            if(!result) {
                setDeleteError("削除対象のスケジュールが見つかりませんでした");
                return;
            }
    
            onDeleted(item.id);
        } catch(err) {
            console.error(err);
            setDeleteError("スケジュールの削除に失敗しました");
        }
    }

    return (
        <li className={`relative flex gap-4 ${isLast ? "" : "pb-8"}`}>
            {!isLast && <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px bg-line" />}
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
                <Icon name={categoryIcons[item.category]} />
            </span>
            <div className="min-w-0 flex-1 pt-1.5">
                <h4 className="flex flex-wrap gap-x-3 gap-y-1 text-base font-bold leading-6">
                    {item.time ? <time dateTime={`${item.date}T${item.time}`}>{item.time}</time> : <span>時刻未定</span>}
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item.title}</span>
                </h4>
                <p className="mt-2 text-sm text-muted">{categoryLabels[item.category]}</p>
                {item.memo && <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-muted [overflow-wrap:anywhere]">{item.memo}</p>}
                {canEdit && (
                    <div className="mt-2 flex flex-wrap gap-x-4">
                        <Link href={`/trips/${item.tripId}/itinerary/${item.id}/edit`} aria-label={`${item.title}を編集`} className="inline-flex min-h-11 items-center text-sm font-medium text-forest underline-offset-4 hover:underline">
                            編集
                        </Link>
                        <button type="button" onClick={handleDelete} aria-label={`${item.title}を削除`} className="min-h-11 text-sm text-red-700 underline-offset-4 hover:underline">
                            削除
                        </button>
                    </div>
                )}
                {deleteError && <p role="alert" className="mt-2 text-sm text-red-700">{deleteError}</p>}
            </div>
        </li>
    )
}
