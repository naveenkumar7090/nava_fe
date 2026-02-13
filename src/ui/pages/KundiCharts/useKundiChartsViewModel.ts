import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { KundliCharts } from '../../../backend_api_client/models/kundli_charts';

export const useKundiChartsViewModel = () => {
    const backendApiClient = useRef(container.resolve(BackendApiClient)).current;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = useMemo(() => {
        const id = searchParams.get('userId');
        return id ? parseInt(id) : undefined;
    }, [searchParams]);

    const profileId = useMemo(() => {
        const id = searchParams.get('profileId');
        return id ? parseInt(id) : undefined;
    }, [searchParams]);

    const [loading, setLoading] = useState(false);
    const [charts, setCharts] = useState<KundliCharts | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCharts = async () => {
        if (!userId && !profileId) {
            setError("No customer or profile selected for analysis.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let data: KundliCharts | undefined;
            if (profileId) {
                data = await backendApiClient.getProfileKundliCharts(profileId);
            } else if (userId) {
                data = await backendApiClient.getAccountKundliCharts(userId);
            }
            setCharts(data || null);
        } catch (err: any) {
            console.error(err);
            setError("Failed to fetch Kundli charts. Please ensure the IDs are valid and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId || profileId) {
            fetchCharts();
        }
    }, [userId, profileId]);

    const handleBack = () => {
        navigate(-1);
    };

    return {
        loading,
        charts,
        error,
        fetchCharts,
        handleBack,
        userId,
        profileId
    };
};
