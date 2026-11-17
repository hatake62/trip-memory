export type Trip = {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    memo: string;
};

export type TripMember = {
    tripId: string;
    userId: string;
    role: 'OWNER' | 'MEMBER';
};

export type CreateTripInput = Omit<Trip, 'id'>;

export type TripStatus = "upcoming" | "ongoing" | "past";

export type FilterStatus = TripStatus | "all";

export type TripFilterProps = {
    status: FilterStatus, 
    setStatus: (status: FilterStatus) => void
};

export type Prop = {
    params: Promise<{id: string}>;
};

export type TripFormProps = 
    | { mode: "create"}
    | { mode: "edit"; trip: Trip};

export type ItineraryItem = {
    id: string;
    tripId: string;
    date: string;
    time: string | null;
    title: string;
    category: ItineraryCategory;
    memo: string;
};

export type ItineraryCategory = 
    | "sightseeing"
    | "food"
    | "transport"
    | "hotel"
    | "other";

export type CreateItineraryInput = Omit<ItineraryItem, "id">;

export type UpdateItineraryInput = Omit<ItineraryItem, "id" | "tripId">;

export type ItineraryFormProps = 
    | {mode: "create"; trip: Trip; initialDate?: string}
    | {mode: "edit"; trip: Trip; item: ItineraryItem};


export type PackingItem = {
    id: string;
    tripId: string;
    name: string;
    isPacked: boolean;
};

export type CreatePackingInput = Omit<PackingItem, "id">;

export type UpdatePackingInput = Pick<PackingItem, "name">;

export type PackingFormProps = 
    | {mode: "create"; trip: Trip}
    | {mode: "edit"; trip: Trip; item: PackingItem};