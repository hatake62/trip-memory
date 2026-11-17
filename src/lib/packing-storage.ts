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

export function togglePackingItem(
    id: string
): PackingItem | undefined {
    const data = getAllPackingItems();

    if(!data.some(item => item.id === id)) {
        return undefined;
    }

    try {
        const toggledItem = data.map(item => (
            item.id === id ? {
                ...item,
                isPacked: !item.isPacked
            } : item
        ));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(toggledItem));
        
        return toggledItem.find(item => item.id === id);
    } catch(err) {
        console.error(err);
        throw new Error("保存に失敗しました");
    }
    

}