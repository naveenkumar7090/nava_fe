import { useState, useMemo, useEffect, useCallback } from 'react';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { Booking } from '../../../backend_api_client/models/booking';
import { ConsultationData } from '../../../config/tableConfig';

/**
 * View Model hook for Consultations page
 * Handles all business logic for fetching and managing consultation bookings
 */
export const useConsultationsViewModel = () => {
    // State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [_, setNextCursor] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Initialize API client
    const apiClient = useMemo(() => new BackendApiClient(), []);

    // Transform booking data to consultation data format
    const transformBookingToConsultation = (booking: Booking, index: number): ConsultationData => {
        // Map status from API to our format
        const getStatus = (apiStatus: string | undefined | null) => {
            // Handle undefined/null status
            if (!apiStatus) {
                console.warn('Missing status for booking:', booking.bookingId);
                return 'Scheduled'; // Default to Scheduled
            }
            const normalizedStatus = apiStatus.toLowerCase();

            // Log for debugging
            if (index === 0) {
                console.log('Status mapping example:', {
                    original: apiStatus,
                    normalized: normalizedStatus,
                    bookingId: booking.bookingId
                });
            }

            switch (normalizedStatus) {
                case 'completed':
                    return 'Completed';
                case 'yet_to_mark':
                case 'scheduled':
                case 'upcoming':
                    return 'Scheduled';
                case 'in_progress':
                case 'ongoing':
                    return 'In Progress';
                case 'cancelled':
                case 'cancel':
                    return 'Cancelled';
                case 'no_show':
                    return 'No Show';
                default:
                    console.warn('Unknown status:', apiStatus, 'for booking:', booking.bookingId);
                    return 'Scheduled';
            }
        };

        // Get consultation type from booking data
        const getConsultationType = (): 'Vastu' | 'Astro' => {
            const consultationType = String(booking.consultationType).toLowerCase();
            if (consultationType.includes('vastu')) {
                return 'Vastu';
            } else if (consultationType.includes('astro') || consultationType.includes('astrology')) {
                return 'Astro';
            }
            return 'Vastu'; // Default to Vastu
        };

        // Get subject name based on consultation type
        // For Astro: use profile name
        // For Vastu: use location name
        const getSubjectName = () => {
            const type = String(booking.consultationType).toLowerCase();

            if (type === 'astro' && booking.profile) {
                return booking.profile.name;
            } else if (type === 'vastu' && booking.location) {
                return booking.location.name;
            }

            // Fallback: log the issue for debugging
            console.warn('Subject name not found:', {
                consultationType: booking.consultationType,
                hasProfile: !!booking.profile,
                hasLocation: !!booking.location,
                bookingId: booking.bookingId
            });

            return 'N/A';
        };

        return {
            id: booking.id.toString(),
            bookingId: booking.bookingId || `#BK-${index.toString().padStart(3, '0')}`,
            accountName: booking.account.name,
            customerName: getSubjectName(), // Profile name for Astro, Location name for Vastu
            consultant: booking.staff.name,
            type: getConsultationType(),
            status: getStatus(booking.status),
            creationDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            bookingDateTime: booking.scheduledStartTime || booking.createdAt,
            orderValue: 0, // Not available in current API
            userId: booking.account.userId,
            profileId: booking.profile?.id ?? null,
            locationId: booking.location?.id ?? null,
            consultantId: booking.staff.id,
        };
    };

    // Fetch bookings function
    const fetchBookings = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`🎫 Fetching bookings from BackendApiClient... Page: ${page}`);

            const limit = 20;
            const cursor = (page - 1) * limit;

            const response = await apiClient.getAdminBookings(limit, cursor);
            console.log('✅ Bookings API Response:', response);

            // Log first booking for debugging
            if (response.bookings && response.bookings.length > 0) {
                console.log('📊 First booking structure:', {
                    consultationType: response.bookings[0].consultationType,
                    hasProfile: !!response.bookings[0].profile,
                    hasLocation: !!response.bookings[0].location,
                    profile: response.bookings[0].profile,
                    location: response.bookings[0].location,
                    status: response.bookings[0].status,
                    bookingId: response.bookings[0].bookingId
                });
            }

            setBookings(response.bookings);
            setCurrentPage(page);
            setNextCursor(response.next);
            setHasNextPage(response.next !== -1);

        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings(1);
    }, [fetchBookings]);

    // Transform booking data to consultation format
    const consultationData = useMemo(() => {
        if (!bookings || bookings.length === 0) {
            return [];
        }

        return bookings.map((booking, index) => transformBookingToConsultation(booking, index));
    }, [bookings]);

    // Calculate statistics from real data
    const statistics = useMemo(() => {
        const totalBookings = consultationData.length;
        const completedBookings = consultationData.filter(row => row.status === 'Completed').length;
        const activeConsultants = new Set(consultationData.map(row => row.consultant)).size;
        const totalRevenue = consultationData
            .filter(row => row.status === 'Completed')
            .reduce((sum, row) => sum + row.orderValue, 0);

        return {
            totalBookings,
            completedBookings,
            activeConsultants,
            totalRevenue,
        };
    }, [consultationData]);

    // Apply client-side filtering
    const filteredData = useMemo(() => {
        return consultationData.filter((row) => {
            const matchesSearch =
                row.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.consultant.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = typeFilter === 'All Types' || row.type === typeFilter;
            const matchesStatus = statusFilter === 'All Status' || row.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [consultationData, searchTerm, typeFilter, statusFilter]);

    // Calculate total pages (estimate based on cursor)
    const totalPages = useMemo(() => {
        if (hasNextPage) {
            return currentPage + 1; // At least one more page
        }
        return currentPage;
    }, [currentPage, hasNextPage]);

    return {
        // Data
        bookings,
        consultationData,
        filteredData,
        statistics,

        // State
        loading,
        error,
        currentPage,
        hasNextPage,
        totalPages,

        // Filters
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,

        // Actions
        fetchBookings,
    };
};
