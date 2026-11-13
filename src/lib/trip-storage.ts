import type { CreateTripInput, Trip } from "./types";

const STORAGE_KEY = "tabilog:trips:v1";

export function getSavedTrips() : Trip[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if(data === null) {
        return [];
    }
    try {
        const json = JSON.parse(data);
        if(!Array.isArray(json)){
            throw new Error("保存データが配列ではありません");
        }
        return json;
    } catch(err: unknown) {
        if(err instanceof Error){
            console.error(err.message);
        }
        throw new Error("保存済みの旅行データを読み込めませんでした");
    }
}

export function addSavedTrip(input: CreateTripInput): Trip {
    const nowTrip = getSavedTrips();
    const id = crypto.randomUUID();
    const newTrip: Trip = {
        ...input,
        id: id,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...nowTrip, newTrip]));
    return newTrip;
}