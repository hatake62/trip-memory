import { getTripStatus } from "@/lib/trip-utils";
import type { Trip } from "@/lib/types";

type TripCardProps = {
    trip: Trip;
};

export default function TripCard({trip}: TripCardProps) {
    return (
        <div className="bg-gray-100 rounded-md p-6 m-4 hover:bg-blue-100">
            <h3 className="font-bold">{trip.title}</h3>
            <p>場所: {trip.destination}</p>
            <p>{trip.startDate} ~ {trip.endDate}</p>
            <p>{getTripStatus(trip)}</p>
        </div>
    )
}