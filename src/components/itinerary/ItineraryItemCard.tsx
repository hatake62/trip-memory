'use client';

import { deleteItineraryItem } from "@/lib/itinerary-storage";
import type { ItineraryItem, ItineraryCategory } from "@/lib/types"
import Link from "next/link";
import { useState } from "react";

type ItineraryItemCardProps = {
  item: ItineraryItem;
  onDeleted: (id: string) => void;
};

const categoryLabels: Record<ItineraryCategory, string> = {
  sightseeing: "観光",
  food: "食事",
  transport: "移動",
  hotel: "宿泊",
  other: "その他",
};

export function ItineraryItemCard({item, onDeleted}: ItineraryItemCardProps) {
    const [ deleteError, setDeleteError ] = useState("");

    function handleDelete() {
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
        <div>
            <h3>日付: {item.date}</h3>
            <p>時刻: {item.time ?? "未定"}</p>
            <p>予定名: {item.title}</p>
            <p>カテゴリ: {categoryLabels[item.category]}</p>
            <p>メモ: {item.memo}</p>
            <Link href={`/trips/${item.tripId}/itinerary/${item.id}/edit`}>
                編集
            </Link>
            <button type="button" onClick={handleDelete}>
                削除
            </button>
            {deleteError && (
                <p role="alert">{deleteError}</p>
            )}
        </div>
    )
}