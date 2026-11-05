import TripCard from "@/components/trips/TripCard";
import { mockData } from "@/lib/mock-data";

const trips = mockData;
export default function Home() {
  return (
    <div>
      <main>
        {trips.map(trip => (
            <TripCard trip={trip} key={trip.id}/>
        ))}
      </main>
    </div>
  );
}
