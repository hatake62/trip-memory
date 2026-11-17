'use client';

import { getPackingItems } from "@/lib/packing-storage";
import { PackingItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { PackingItemRow } from "./PackingItemRow";

type PackingProps = {
    tripId: string;
};

export function PackingList({tripId}: PackingProps) {
    const [ itemData, setItemData ] = useState<PackingItem[]>();
    const [ error, setError ] = useState("");

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
    return (
        <div>
            {itemData?.map(item => (
                <PackingItemRow key={item.id} item={item} />
            ))}
        </div>
    )

}