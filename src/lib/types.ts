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
