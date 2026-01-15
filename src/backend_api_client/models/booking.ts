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
    rating: number | null;
    meetingLink: string | null;
    price: number | null;
    updatedAt: string;
}
