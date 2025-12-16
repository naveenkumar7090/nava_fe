import { useState, useEffect, useMemo } from 'react';
import { Booking } from '../../../backend_api_client/models/booking';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    designation?: string;
    phone?: string;
    additional_information?: string;
    photo?: string;
    assigned_services?: string[];
    status?: string;
    // Additional fields from Zoho or local augmentation
    experience_years?: number;
    total_bookings?: number;
    avg_rating?: number;
    total_commission?: number;
    type?: 'Vastu' | 'Astro';
}

export const useConsultantDetailsViewModel = (staffId: string | undefined) => {
    const [consultant, setConsultant] = useState<StaffMember | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiClient = useMemo(() => new BackendApiClient(), []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!staffId) {
                return;
            }

            setLoading(true);
            try {
                // Fetch staff details
                const data = await apiClient.getStaffDetails(staffId);

                // Transform/enrich data if necessary to match StaffMember interface
                const transformedStaff: StaffMember = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    designation: data.designation, // e.g., "Consultant"
                    phone: data.phone || data.contact_number,
                    photo: data.photo, // Check if this is a URL or base64
                    status: data.status,
                    // Mock/Default some fields that might not be in the basic staff object yet, or use enriched data if available
                    experience_years: 5,
                    total_bookings: 0,
                    avg_rating: 0,
                    total_commission: 0,
                    type: data.consultationTypes && data.consultationTypes.length > 0
                        ? (data.consultationTypes.includes('astro') ? 'Astro' : 'Vastu') // Simple logic, might need refinement
                        : 'Vastu'
                };

                setConsultant(transformedStaff);

                // Fetch bookings for this staff
                const bookingsResponse = await apiClient.getAdminBookings(100, 0, staffId);
                setBookings(bookingsResponse.bookings);

                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch consultant details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [staffId, apiClient]);

    return {
        consultant,
        bookings,
        loading,
        error
    };
};
