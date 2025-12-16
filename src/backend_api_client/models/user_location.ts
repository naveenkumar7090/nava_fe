export interface UserLocationSpace {
    id: number;
    name: string;
    direction: string;
    bearing: number;
}

export interface UserLocationFloor {
    id: number;
    userLocationId: number;
    vastuScore: number;
    floorNumber: number;
    status: string;
    space: UserLocationSpace[];
    data?: any; // Vastu report data
}

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
    floors: UserLocationFloor[];
}

