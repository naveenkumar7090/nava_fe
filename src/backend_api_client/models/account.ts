export interface Account {
    id: number;
    email: string | null;
    mobile: string | null;
    name: string;
    gender: string;
    dateTimeOfBirth: Date;
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
