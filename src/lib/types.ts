export type Trip = {
    id: number;
    title: string;
    destination: string;
    startDate: number;
    endDate: number;
    memo: string;
};

export type TripMember = {
    tripId: number;
    userId: number;
    role: string;
};

export type CreateTripInput = Omit<Trip, 'id'>;
