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

    // Saved PDFs State
    const [savedPDFs, setSavedPDFs] = useState<Array<{ id: number; name: string; date: string; file_url?: string }>>([]);
    const [loadingPDFs, setLoadingPDFs] = useState(false);

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
                    const existingRemedy = await apiClient.getRemedyData(bookingId);
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

                // Fetch saved PDFs
                try {
                    setLoadingPDFs(true);
                    const pdfs = await apiClient.getSavedRemedyPDFs(bookingId);
                    setSavedPDFs(pdfs);
                } catch (pdfError) {
                    console.log("No saved PDFs found or failed to fetch", pdfError);
                    setSavedPDFs([]);
                } finally {
                    setLoadingPDFs(false);
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

            // Refresh saved PDFs list after saving
            try {
                const pdfs = await apiClient.getSavedRemedyPDFs(bookingId);
                setSavedPDFs(pdfs);
            } catch (pdfError) {
                console.log("Failed to refresh PDFs list", pdfError);
            }
        } catch (error) {
            console.error('❌ Error saving remedy data:', error);
            alert('Error saving remedy data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };



    const downloadPDF = async (pdf: { id: number; name: string; date: string; file_url?: string }) => {
        if (!bookingId) return;

        try {
            const downloadUrl = pdf.file_url || `/admin/consultation/${bookingId}/remedy/pdf`;

            const baseUrl = apiClient.baseURL;
            const fullUrl = downloadUrl.startsWith('http')
                ? downloadUrl
                : `${baseUrl.replace(/\/$/, '')}${downloadUrl}`;

            window.open(fullUrl, '_blank');
        } catch (error) {
            console.error('❌ Error viewing PDF:', error);
            alert('Failed to view PDF. Please try again.');
        }
    };

    const updateStatus = async (status: 'completed' | 'cancel' | 'noshow') => {
        if (!bookingId) return;

        if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) {
            return;
        }

        try {
            await apiClient.updateBookingStatus(bookingId, status);
            // Refresh booking details
            const data = await apiClient.getAdminBooking(bookingId);
            setBooking(data);
        } catch (e) {
            alert(`Failed to update status: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };

    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const checkAvailability = async (date: Date) => {
        if (!bookingId) return;
        setLoadingSlots(true);
        setSelectedDate(date);
        try {
            const dateStr = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            const { slots } = await apiClient.getBookingSlots(bookingId, dateStr);
            setAvailableSlots(slots);
        } catch (e) {
            console.error("Failed to check availability", e);
            alert("Failed to fetch slots");
        } finally {
            setLoadingSlots(false);
        }
    };

    const confirmReschedule = async (slot: Date) => {
        if (!bookingId) return;
        if (!window.confirm(`Reschedule to ${slot.toLocaleString()}?`)) return;

        try {
            await apiClient.rescheduleBooking(bookingId, slot.toISOString());
            setRescheduleDialogOpen(false);
            const data = await apiClient.getAdminBooking(bookingId);
            setBooking(data);
            alert("Rescheduled successfully!");
        } catch (e) {
            alert("Failed to reschedule");
        }
    };

    const openRescheduleDialog = () => {
        setRescheduleDialogOpen(true);
        // Default to today
        checkAvailability(new Date());
    };

    return {
        booking,
        loading,
        error,
        remedyData,
        handleRemedyInputChange,
        isSaving,
        saveRemedyData,
        updateStatus,
        savedPDFs,
        loadingPDFs,
        downloadPDF,
        rescheduleState: {
            open: rescheduleDialogOpen,
            setOpen: setRescheduleDialogOpen,
            openDialog: openRescheduleDialog,
            selectedDate,
            availableSlots,
            loadingSlots,
            checkAvailability,
            confirmReschedule
        }
    };
};
