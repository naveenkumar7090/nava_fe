export interface UserLocation {
    id: number;
    locationId: number;
    locationName: string;
    buildingType: string | null;
    layout: string | null;
    scanningMethod: string;
    vastuScore: number;
    status: string;
    floorCount: number;
    createdAt: string;
    location: {
        name: string;
    };
    floors: {
        id: number;
        userLocationId: number;
        vastuScore: number;
        floorNumber: number;
        status: string;
        space: any[]; // Assuming it's an array of spaces
    }[];
}
