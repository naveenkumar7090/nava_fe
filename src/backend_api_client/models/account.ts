export interface Account {
    id: number;
    email: string | null;
    mobile: string | null;
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    timezoneOffset: string;
    lat: number;
    lon: number;
    profilePicture?: string;
    sunSign?: {
        name: string;
        image: string;
        data: any;
    };
    moonSign?: {
        name: string;
        image: string;
        data: any;
    };
}
