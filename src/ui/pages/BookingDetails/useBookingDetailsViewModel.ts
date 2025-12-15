import { useState, useEffect, useMemo } from 'react';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { Booking } from '../../../backend_api_client/models/booking';
import { RemedyData } from '../../../backend_api_client/models/remedy_data';

export const useBookingDetailsViewModel = (bookingId: number | null) => {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Remedy State
    const [remedyData, setRemedyData] = useState<RemedyData>({
        problems: '',
        diagnosis: '',
        suggestions: '',
        products: '',
        reminders: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const apiClient = useMemo(() => new BackendApiClient(), []);

    useEffect(() => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        const fetchBooking = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiClient.getAdminBooking(bookingId);
                setBooking(data);

                // Fetch existing remedy data
                try {
                    const existingRemedy = await apiClient.getRemedyPDF(bookingId);
                    if (existingRemedy) {
                        setRemedyData(prev => ({
                            ...prev,
                            // Merge and handle potential nulls/undefined from backend
                            problems: existingRemedy.problems || '',
                            diagnosis: existingRemedy.diagnosis || '',
                            suggestions: existingRemedy.suggestions || '',
                            products: existingRemedy.products || '',
                            reminders: existingRemedy.reminders || '',
                        }));
                    }
                } catch (remedyError) {
                    console.log("No existing remedy found or failed to fetch", remedyError);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch booking');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, apiClient]);

    const handleRemedyInputChange = (field: keyof RemedyData, value: string) => {
        setRemedyData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveRemedyData = async () => {
        if (!bookingId) return;

        const hasContent = remedyData.problems || remedyData.diagnosis || remedyData.suggestions || remedyData.products || remedyData.reminders;
        if (!hasContent) {
            alert('Please fill in at least one field before saving.');
            return;
        }

        setIsSaving(true);

        try {
            await apiClient.updateRemedyData(bookingId, remedyData);
            alert('Remedy data saved successfully!');
        } catch (error) {
            console.error('❌ Error saving remedy data:', error);
            alert('Error saving remedy data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        booking,
        loading,
        error,
        remedyData,
        handleRemedyInputChange,
        isSaving,
        saveRemedyData
    };
};
