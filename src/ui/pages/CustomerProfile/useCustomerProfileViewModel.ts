import { useState, useEffect, useMemo } from 'react';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { UserProfile } from '../../../backend_api_client/models/user_profile';
import { Booking } from '../../../backend_api_client/models/booking';
import { RemedyData } from '../../../backend_api_client/models/remedy_data';

export const useCustomerProfileViewModel = (userId: string | undefined, profileId: string | undefined) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remedyDataMap, setRemedyDataMap] = useState<Map<number, RemedyData>>(new Map());

    const apiClient = useMemo(() => new BackendApiClient(), []);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !profileId) {
                setError('Invalid User ID or Profile ID');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // 1. Fetch Profile
                let pId: number | 'default';
                if (profileId === 'default') {
                    pId = 'default';
                } else {
                    pId = parseInt(profileId);
                    if (isNaN(pId)) {
                        setError('Invalid Profile ID format');
                        setLoading(false);
                        return;
                    }
                }

                const profileData = await apiClient.getUserProfile(parseInt(userId), pId);
                setProfile(profileData);
                setError(null);

                // 2. Fetch Bookings for this profile
                // We need the numeric profile ID. If we fetched 'default', profileData.id has the ID.
                if (profileData && profileData.id) {
                    const bookingsData = await apiClient.getAdminBookings(100, 0, undefined, profileData.id);
                    setBookings(bookingsData.bookings);

                    // 3. Fetch remedy data for completed bookings
                    const remedyMap = new Map<number, RemedyData>();
                    const completedBookings = bookingsData.bookings.filter(b => b.status?.toLowerCase() === 'completed');
                    
                    await Promise.all(
                        completedBookings.map(async (booking) => {
                            try {
                                const remedy = await apiClient.getRemedyPDF(booking.id);
                                if (remedy && (remedy.problems || remedy.diagnosis || remedy.suggestions || remedy.products || remedy.reminders)) {
                                    remedyMap.set(booking.id, remedy);
                                }
                            } catch (err) {
                                // No remedy data found for this booking, skip it
                                console.log(`No remedy data for booking ${booking.id}`);
                            }
                        })
                    );
                    setRemedyDataMap(remedyMap);
                }

            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, profileId, apiClient]);

    return {
        profile,
        bookings,
        loading,
        error,
        remedyDataMap
    };
};
