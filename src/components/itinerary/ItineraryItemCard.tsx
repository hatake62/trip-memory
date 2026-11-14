import type { ItineraryItem, ItineraryCategory } from "@/lib/types"

type ItineraryItemCardProps = {
    item: ItineraryItem;
};

const categoryLabels: Record<ItineraryCategory, string> = {
  sightseeing: "観光",
  food: "食事",
  transport: "移動",
  hotel: "宿泊",
  other: "その他",
};

export function ItineraryItemCard({item}: ItineraryItemCardProps) {
    return (
        <div>
            <h3>日付: {item.date}</h3>
            <p>時刻: {item.time ?? "未定"}</p>
            <p>予定名: {item.title}</p>
            <p>カテゴリ: {categoryLabels[item.category]}</p>
            <p>メモ: {item.memo}</p>
        </div>
    )
}