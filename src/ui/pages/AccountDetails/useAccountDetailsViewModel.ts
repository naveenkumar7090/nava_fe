import { useState, useEffect, useMemo, useCallback } from 'react';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { Account } from '../../../backend_api_client/models/account';
import { UserProfile } from '../../../backend_api_client/models/user_profile';
import { Booking } from '../../../backend_api_client/models/booking';
import { UserLocation } from '../../../backend_api_client/models/user_location';

/**
 * View Model hook for Account Details page
 * Handles fetching and managing account data, profiles, locations, and bookings
 */
export const useAccountDetailsViewModel = (userId: number | null) => {
    // State
    const [account, setAccount] = useState<Account | null>(null);
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [locations, setLocations] = useState<UserLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize API client
    const apiClient = useMemo(() => new BackendApiClient(), []);

    // Fetch all account data
    const fetchAccountData = useCallback(async (uid: number) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching account data in parallel for user ID:', uid);

            // Execute all API calls concurrently
            const [accountResult, profilesResult, locationsResult, bookingsResult] = await Promise.allSettled([
                apiClient.getAccountById(uid),
                apiClient.getUserProfiles(uid, true),
                apiClient.getUserLocations(uid),
                apiClient.getAdminBookings(100, 0)
            ]);

            // Handle Account Data (Critical)
            if (accountResult.status === 'fulfilled') {
                console.log('✅ Account data fetched:', accountResult.value);
                setAccount(accountResult.value);
            } else {
                throw accountResult.reason;
            }

            // Handle Profiles
            if (profilesResult.status === 'fulfilled') {
                console.log('✅ Profiles fetched:', profilesResult.value.profiles.length);
                setProfiles(profilesResult.value.profiles || []);
            } else {
                console.warn('⚠️ Failed to fetch profiles:', profilesResult.reason);
                setProfiles([]);
            }

            // Handle Locations
            if (locationsResult.status === 'fulfilled') {
                console.log('✅ Locations fetched:', locationsResult.value.length);
                setLocations(locationsResult.value);
            } else {
                console.warn('⚠️ Failed to fetch locations:', locationsResult.reason);
                setLocations([]);
            }

            // Handle Bookings
            if (bookingsResult.status === 'fulfilled') {
                const userBookings = bookingsResult.value.bookings.filter(
                    booking => booking.account.userId === uid
                );
                console.log('✅ User bookings fetched:', userBookings.length);
                setBookings(userBookings);
            } else {
                console.warn('⚠️ Failed to fetch bookings:', bookingsResult.reason);
                setBookings([]);
            }

        } catch (err) {
            console.error('❌ Error fetching account data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch account data');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    // Fetch data when userId changes
    useEffect(() => {
        if (userId !== null && userId > 0) {
            fetchAccountData(userId);
        } else {
            setLoading(false);
            setError('Invalid user ID');
        }
    }, [userId, fetchAccountData]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

        return {
            totalBookings,
            completedBookings,
            upcomingBookings,
            cancelledBookings,
            totalProfiles: profiles.length,
            totalLocations: locations.length,
        };
    }, [bookings, profiles, locations]);

    // Get default profile
    const defaultProfile = useMemo(() => {
        return profiles.find(p => p.isDefault) || profiles[0] || null;
    }, [profiles]);

    return {
        // Data
        account,
        profiles,
        locations,
        bookings,
        defaultProfile,
        statistics,

        // State
        loading,
        error,

        // Actions
        refetch: () => {
            if (userId !== null && userId > 0) {
                fetchAccountData(userId);
            }
        },
    };
};
