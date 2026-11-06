import { Trip, TripStatus } from "./types";

export function getTripStatus(trip: Trip): TripStatus {
    const now = new Date().toISOString().split('T')[0];

    if(now > trip.endDate) {
        return "past";
    } else if(now < trip.startDate) {
        return "upcoming";
    } else {
        return "ongoing";
    }

}