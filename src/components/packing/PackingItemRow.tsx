import { PackingItem } from "@/lib/types"

type PackingItemRowProps = {
    item: PackingItem;
};

export function PackingItemRow(
    { item } : PackingItemRowProps
) {
    const message = item.isPacked ? "準備済み" : "未準備";

    return (
        <div>
            <h3>{item.name}</h3>
            <p>{message}</p>
        </div>
    )
}