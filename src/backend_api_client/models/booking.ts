export interface Booking {
    id: number;
    bookingId: string;
    consultationType: 'astro' | 'vastu';

    // Account details (user who placed the order)
    account: {
        userId: number;
        name: string;
        email: string;
        mobile: string | null;
    };

    // Profile details (for Astro consultations, null for Vastu)
    profile: {
        id: number;
        name: string;
        dateOfBirth?: string;
        timeOfBirth?: string;
        placeOfBirth?: string;
        gender?: string;
        sunSign?: string;
        moonSign?: string;
    } | null;

    // Location details (for Vastu consultations, null for Astro)
    location: {
        id: number;
        name: string;
    } | null;

    // Service details
    service: {
        id: string;
        name: string;
    };

    // Staff details
    staff: {
        id: string;
        name: string;
    };

    // Schedule fields (flattened)
    createdAt: string; // When booking was created/placed
    scheduledStartTime: string | null; // When consultation is scheduled for
    scheduledEndTime: string | null;
    duration: string;
    status: string;

    // Additional details
    email: string;
    preferredLanguage: string;
    topicOfDiscussion: string | null;
    detailedTopicOfDiscussion: string | null;
    rating: number | null;
    meetingLink: string | null;
    price: number | null;
    updatedAt: string;
}

export enum BookingStatus {
    upcoming = "upcoming",
    ongoing = "ongoing",
    yet_to_mark = "yet_to_mark",
    cancelled = "cancelled",
    completed = "completed",
    no_show = "no_show",
}

function isBookingStatus(value: string): value is BookingStatus {
    return Object.values(BookingStatus).includes(value as BookingStatus); 
}

export function parseBookingStatus(value: string): BookingStatus {
    if (!isBookingStatus(value)) {
        throw new Error(`Cannot parse ${value} to booking status`);
    }

    return value as BookingStatus;
}