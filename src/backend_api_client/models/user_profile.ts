export interface UserProfile {
    id: number;
    userId: number;
    name: string;
    gender: string;
    dateTimeOfBirth: Date;
    placeOfBirth: string;
    timezoneOffset: number;
    lat: number;
    lon: number;
    isDefault: boolean;
    sunSign: string;
    moonSign: string;
}
