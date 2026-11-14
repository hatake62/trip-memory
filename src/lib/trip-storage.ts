import { mockData } from "./mock-data";
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

export function getTripById(id: string): Trip | undefined {
  const savedData = getSavedTrips();
  const data = [...savedData, ...mockData];

  return data.find(trip => trip.id === id);
}

export function updateSavedTrip(
    id: string,
    input: CreateTripInput
): Trip | undefined {
    const savedTrip = getSavedTrips();

    if(!savedTrip.some(trip => trip.id === id)){
        return undefined;
    }

    const updatedTrip = savedTrip.map(trip => 
        trip.id === id 
            ? {...trip, ...input} 
            : trip
    );

    localStorage.setItem(
        STORAGE_KEY, 
        JSON.stringify(updatedTrip)
    );

    return updatedTrip.find(trip => trip.id === id);
}

export function deleteSavedTrip(id: string): boolean {
    const savedTrip = getSavedTrips();
    const deletedTrip = savedTrip.filter(trip => trip.id !== id);
    if(deletedTrip.length === savedTrip.length){
        return false;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(deletedTrip)
    );
    return true;
}