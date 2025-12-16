import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendApiClient } from '../../../backend_api_client/backend_api_client';
import { UserLocation } from '../../../backend_api_client/models/user_location';

export const useUserLocationDetailsViewModel = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        fetchLocation();
    }, [locationId]);

    return {
        location,
        loading,
        error
    };
};
