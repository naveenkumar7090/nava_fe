export interface UserProfile {
    id: number;
    userId: number;
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    timezoneOffset: number;
    lat: number;
    lon: number;
    isDefault: boolean;
    sunSign: string;
    moonSign: string;
}
