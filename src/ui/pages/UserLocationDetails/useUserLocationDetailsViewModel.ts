import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendApiClient } from '../../../backend_api_client/backend_api_client';
import { UserLocation } from '../../../backend_api_client/models/user_location';
import { Booking } from '../../../backend_api_client/models/booking';
import { RemedyData } from '../../../backend_api_client/models/remedy_data';

export const useUserLocationDetailsViewModel = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [remedyDataMap, setRemedyDataMap] = useState<Map<number, RemedyData>>(new Map());

    const fetchData = async () => {
        if (!locationId) return;

        try {
            setLoading(true);
            const locId = parseInt(locationId);

            // 1. Fetch location details
            const locationData = await backendApiClient.getUserLocationById(locId);
            setLocation(locationData);

            // 2. Fetch bookings for this location
            const bookingsData = await backendApiClient.getAdminBookings(100, 0, undefined, undefined, locId);
            setBookings(bookingsData.bookings);

            // 3. Fetch remedy data for completed bookings
            const remedyMap = new Map<number, RemedyData>();
            const completedBookings = bookingsData.bookings.filter(b => b.status?.toLowerCase() === 'completed');

            await Promise.all(
                completedBookings.map(async (booking) => {
                    try {
                        const remedy = await backendApiClient.getRemedyData(booking.id);
                        if (remedy && (remedy.problems || remedy.diagnosis || remedy.suggestions || remedy.products || remedy.reminders)) {
                            remedyMap.set(booking.id, remedy);
                        }
                    } catch (err) {
                        console.log(`No remedy data for booking ${booking.id}`);
                    }
                })
            );
            setRemedyDataMap(remedyMap);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch location details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [locationId]);

    const uploadReport = async (file: File) => {
        if (!locationId) return;

        try {
            setUploading(true);
            await backendApiClient.uploadMapPdf(parseInt(locationId), file);
            await fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            setError('Failed to upload report');
        } finally {
            setUploading(false);
        }
    };

    const downloadMap = async (mapId: number, fileName: string) => {
        if (!locationId) return;
        try {
            await backendApiClient.downloadMapPdf(parseInt(locationId), mapId, fileName);
        } catch (err) {
            console.error(err);
            setError('Failed to download map');
        }
    }

    return {
        location,
        loading,
        uploading,
        error,
        bookings,
        remedyDataMap,
        uploadReport,
        downloadMap
    };
};
