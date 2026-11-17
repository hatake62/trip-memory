import { PackingItem } from "@/lib/types"

type PackingItemRowProps = {
    item: PackingItem;
    onToggle: (id: string) => void;
};

export function PackingItemRow(
    { item, onToggle } : PackingItemRowProps
) {
    const message = item.isPacked ? "準備済み" : "未準備";

    return (
        <div>
            <label>
                <input 
                    type="checkbox"
                    checked={item.isPacked}
                    onChange={() => onToggle(item.id)}
                />
                {item.name}
            </label>
            <p>{message}</p>
        </div>
    )
}