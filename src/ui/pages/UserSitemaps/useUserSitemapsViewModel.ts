import { useState, useEffect, useMemo } from 'react';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { UserSitemap } from '../../../backend_api_client/models/user_sitemap';

export const useUserSitemapsViewModel = () => {
    const [sitemaps, setSitemaps] = useState<UserSitemap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const apiClient = container.resolve(BackendApiClient);

    const fetchSitemaps = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.getAllSitemaps();
            setSitemaps(data);
        } catch (err) {
            console.error('Error fetching user sitemaps:', err);
            setError('Failed to load user sitemaps. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSitemaps();
    }, []);

    const filteredSitemaps = useMemo(() => {
        if (!searchTerm) return sitemaps;

        const lowerSearch = searchTerm.toLowerCase();
        return sitemaps.filter(s =>
            s.user.name.toLowerCase().includes(lowerSearch) ||
            s.locationName.toLowerCase().includes(lowerSearch) ||
            s.sitemap.name.toLowerCase().includes(lowerSearch)
        );
    }, [sitemaps, searchTerm]);

    return {
        sitemaps: filteredSitemaps,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        refresh: fetchSitemaps,
    };
};
