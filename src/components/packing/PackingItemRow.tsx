'use client';

import { deletePackingItem } from "@/lib/packing-storage";
import { PackingItem } from "@/lib/types"
import Link from "next/link";
import { useState } from "react";

type PackingItemRowProps = {
    item: PackingItem;
    onToggle: (id: string) => void;
    onDeleted: (id: string) => void;
};

export function PackingItemRow(
    { item, onToggle, onDeleted } : PackingItemRowProps
) {
    const message = item.isPacked ? "準備済み" : "未準備";
    const [ deleteError, setDeleteError ] = useState("");

    function handleDelete() {
            const confirmed = window.confirm(
                "この持ち物を削除しますか？この操作は取り消せません"
            );
        
            if(!confirmed) {
                return;
            }
        
            try {
                const result = deletePackingItem(item.id);
        
                if(!result) {
                    setDeleteError("削除対象の持ち物が見つかりませんでした");
                    return;
                }
        
                onDeleted(item.id);
            } catch(err) {
                console.error(err);
                setDeleteError("持ち物の削除に失敗しました");
            }
        }

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
            <Link href={`/trips/${item.tripId}/packing/${item.id}/edit`}>
                編集
            </Link>
            <button onClick={handleDelete}>
                削除
            </button>
            {deleteError && <p role="alert" className="mt-2 text-sm text-red-700">{deleteError}</p>}
        </div>
    )
}