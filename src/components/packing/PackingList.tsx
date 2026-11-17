'use client';

import { getPackingItems, togglePackingItem } from "@/lib/packing-storage";
import type { PackingItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingItemRow } from "./PackingItemRow";

type PackingProps = {
    tripId: string;
};

export function PackingList({tripId}: PackingProps) {
    const [ itemData, setItemData ] = useState<PackingItem[]>();
    const [ error, setError ] = useState("");
    const [ updateError, setUpdateError ] = useState("");


    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const data = getPackingItems(tripId);
                setItemData(data);
            } catch(err) {
                console.error(err);
                setError("アイテムの取得に失敗しました。");
            } 
        }, 0);

        return () => window.clearTimeout(timerId);
    }, [tripId]);

    

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (itemData === undefined) {
        return <p>持ち物リストを読み込んでいます...</p>;
    }

    if(itemData.length === 0) {
        return <p>まだ持ち物が登録されていません</p>;
    }

    function handleToggle(id: string) {
        try {
            const result = togglePackingItem(id);
            if(result === undefined) {
                setUpdateError("持ち物が見つかりません");
                return;
            }
            setItemData(prev => 
                prev?.map(item => 
                    item.id === id ? result : item
                )
            );
        } catch(err) {
            console.error(err);
            setUpdateError("持ち物の更新に失敗しました");
        }
    }

    return (
        <div>
            {updateError && (
                <p role="alert">{updateError}</p>
            )}
            {itemData.map(item => (
                <PackingItemRow 
                    key={item.id} 
                    item={item}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    )

}