import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendApiClient } from '../../../backend_api_client/backend_api_client';
import { UserLocation } from '../../../backend_api_client/models/user_location';

export const useUserLocationDetailsViewModel = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        if (!locationId) return;

        try {
            setLoading(true);
            const data = await backendApiClient.getUserLocationById(parseInt(locationId));
            setLocation(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch location details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [locationId]);

    const uploadReport = async (file: File) => {
        if (!locationId) return;

        try {
            setUploading(true);
            await backendApiClient.uploadMapPdf(parseInt(locationId), file);
            await fetchLocation(); // Refresh data
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
        uploadReport,
        downloadMap
    };
};
