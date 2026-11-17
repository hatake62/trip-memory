import type { CreatePackingInput, PackingItem } from "./types";

const STORAGE_KEY = "tabilog:packing:v1";


function getAllPackingItems(): PackingItem[] {
    const data = localStorage.getItem(STORAGE_KEY);

    if(data === null){
        return [];
    }

    try {
        const json = JSON.parse(data);
        if(!Array.isArray(json)){
            throw new Error("アイテムデータが配列ではありません");
        }
        return json;
    } catch(err: unknown) {
        if(err instanceof Error){
            console.error(err.message);
        }
        throw new Error("保存済みのアイテムデータを読み込めませんでした");
    }

}

export function getPackingItems(
    tripId: string
): PackingItem[] {
    const items = getAllPackingItems();
    return items.filter(item => item.tripId === tripId);
}

export function addPackingItem(
    input: CreatePackingInput,
): PackingItem {
    const nowData = getAllPackingItems();
    const id = crypto.randomUUID();

    const newData: PackingItem = {
        ...input,
        id: id,
        isPacked: false,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...nowData, newData]));
    return newData;
}