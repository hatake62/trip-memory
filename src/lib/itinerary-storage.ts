import type { CreateItineraryInput, ItineraryItem, UpdateItineraryInput } from "./types";
const STORAGE_KEY = "tabilog:itinerary:v1";

function getAllItineraryItems(): ItineraryItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if(data === null) {
        return [];
    }
    
    try {
        const json = JSON.parse(data);
        if(!Array.isArray(json)){
            throw new Error("スケジュールデータが配列ではありません");
        }
        return json;
    } catch(err: unknown) {
        if(err instanceof Error){
            console.error(err.message);
        }
        throw new Error("保存済みのスケジュールデータを読み込めませんでした");
    }
}

export function getItineraryItems(tripId: string): ItineraryItem[] {
    const items = getAllItineraryItems();
    return items.filter(item => item.tripId === tripId);
}

export function addItineraryItem(input: CreateItineraryInput): ItineraryItem {
    const nowItem = getAllItineraryItems();
    const id = crypto.randomUUID();
    const newItem: ItineraryItem = {
        ...input,
        id
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...nowItem, newItem])
    );
    return newItem;

}

export function updateItineraryItem(
    id: string,
    input: UpdateItineraryInput,
) : ItineraryItem | undefined {
    const allItems = getAllItineraryItems();

    if(!allItems.some(item => item.id === id)){
        return undefined;
    }

    const items = allItems.map(item => (
        item.id === id 
            ? { ...item, ...input}
            : item 
    ));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    return items.find(item => item.id === id);
}

export function deleteItineraryItem(
    id: string
): boolean {
    const allItems = getAllItineraryItems();

    if(!allItems.some(item => item.id === id)){
        return false;
    }

    try {
        const deletedItems = allItems.filter(item => (
            item.id !== id
        ));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(deletedItems));
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("保存に失敗しました。");
    }
}