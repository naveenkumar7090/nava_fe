import { useState, useEffect, useMemo } from 'react';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import { Booking } from '../../../backend_api_client/models/booking';
import { RemedyData } from '../../../backend_api_client/models/remedy_data';
import jsPDF from 'jspdf';

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

    const generateAndDownloadPDF = () => {
        if (!booking) {
            alert('Booking information is not available.');
            return;
        }

        // Validate that at least one remedy field has content
        const hasContent = remedyData.problems || remedyData.diagnosis || remedyData.suggestions || remedyData.products || remedyData.reminders;
        if (!hasContent) {
            alert('Please fill in at least one remedy field before generating the PDF.');
            return;
        }

        try {
            // Create new PDF document
            const doc = new jsPDF();
            
            // Set font and title
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Remedy Report', 20, 30);
            
            let yPosition = 50;

            // Booking Information Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Booking Information', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Booking ID: ${booking.bookingId}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Service: ${booking.service?.name || 'N/A'}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Consultation Type: ${booking.consultationType?.charAt(0).toUpperCase() + booking.consultationType?.slice(1) || 'N/A'}`, 20, yPosition);
            yPosition += 8;
            if (booking.scheduledStartTime) {
                const scheduledDate = new Date(booking.scheduledStartTime);
                doc.text(`Consultation Date: ${scheduledDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`, 20, yPosition);
                yPosition += 8;
                doc.text(`Consultation Time: ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 20, yPosition);
                yPosition += 8;
            }
            doc.text(`Status: ${booking.status}`, 20, yPosition);
            yPosition += 15;

            // Customer Information Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Customer Information', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Name: ${booking.account?.name || 'N/A'}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Email: ${booking.account?.email || 'N/A'}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Mobile: ${booking.account?.mobile || 'N/A'}`, 20, yPosition);
            yPosition += 15;

            // Profile/Location Information Section
            if (booking.profile) {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Astro Profile Information', 20, yPosition);
                yPosition += 10;
                
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(`Profile Name: ${booking.profile.name || 'N/A'}`, 20, yPosition);
                yPosition += 8;
                if (booking.profile.dateOfBirth) {
                    const dob = new Date(booking.profile.dateOfBirth);
                    doc.text(`Date of Birth: ${dob.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`, 20, yPosition);
                    yPosition += 8;
                }
                if (booking.profile.timeOfBirth) {
                    const tob = new Date(booking.profile.timeOfBirth);
                    doc.text(`Time of Birth: ${tob.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 20, yPosition);
                    yPosition += 8;
                }
                if (booking.profile.placeOfBirth) {
                    doc.text(`Place of Birth: ${booking.profile.placeOfBirth}`, 20, yPosition);
                    yPosition += 8;
                }
                if (booking.profile.gender) {
                    doc.text(`Gender: ${booking.profile.gender}`, 20, yPosition);
                    yPosition += 8;
                }
                if (booking.profile.sunSign) {
                    doc.text(`Sun Sign: ${booking.profile.sunSign}`, 20, yPosition);
                    yPosition += 8;
                }
                if (booking.profile.moonSign) {
                    doc.text(`Moon Sign: ${booking.profile.moonSign}`, 20, yPosition);
                    yPosition += 8;
                }
                yPosition += 10;
            }

            if (booking.location) {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Vastu Location Information', 20, yPosition);
                yPosition += 10;
                
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(`Location Name: ${booking.location.name || 'N/A'}`, 20, yPosition);
                yPosition += 15;
            }

            // Check if we need a new page
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }

            // Remedy Information Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Remedy Information', 20, yPosition);
            yPosition += 15;
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            
            // Problems section
            if (remedyData.problems) {
                doc.setFont('helvetica', 'bold');
                doc.text('Problems:', 20, yPosition);
                yPosition += 8;
                doc.setFont('helvetica', 'normal');
                const problemsLines = doc.splitTextToSize(remedyData.problems, 170);
                doc.text(problemsLines, 20, yPosition);
                yPosition += problemsLines.length * 6 + 10;
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
            }
            
            // Diagnosis section
            if (remedyData.diagnosis) {
                doc.setFont('helvetica', 'bold');
                doc.text('Diagnosis:', 20, yPosition);
                yPosition += 8;
                doc.setFont('helvetica', 'normal');
                const diagnosisLines = doc.splitTextToSize(remedyData.diagnosis, 170);
                doc.text(diagnosisLines, 20, yPosition);
                yPosition += diagnosisLines.length * 6 + 10;
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
            }
            
            // Suggestions section
            if (remedyData.suggestions) {
                doc.setFont('helvetica', 'bold');
                doc.text('Suggestions:', 20, yPosition);
                yPosition += 8;
                doc.setFont('helvetica', 'normal');
                const suggestionsLines = doc.splitTextToSize(remedyData.suggestions, 170);
                doc.text(suggestionsLines, 20, yPosition);
                yPosition += suggestionsLines.length * 6 + 10;
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
            }
            
            // Products section
            if (remedyData.products) {
                doc.setFont('helvetica', 'bold');
                doc.text('Recommended Products:', 20, yPosition);
                yPosition += 8;
                doc.setFont('helvetica', 'normal');
                const productsLines = doc.splitTextToSize(remedyData.products, 170);
                doc.text(productsLines, 20, yPosition);
                yPosition += productsLines.length * 6 + 10;
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
            }
            
            // Reminders section
            if (remedyData.reminders) {
                doc.setFont('helvetica', 'bold');
                doc.text('Reminders:', 20, yPosition);
                yPosition += 8;
                doc.setFont('helvetica', 'normal');
                const remindersLines = doc.splitTextToSize(remedyData.reminders, 170);
                doc.text(remindersLines, 20, yPosition);
            }
            
            // Add footer with date
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text(`Generated on: ${currentDate}`, 20, doc.internal.pageSize.height - 20);
            
            // Generate filename
            const customerName = booking.account?.name?.replace(/\s+/g, '_') || 'customer';
            const fileName = `remedy_${customerName}_${booking.bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Download the PDF
            doc.save(fileName);
            
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    const downloadPDF = async (pdf: { id: number; name: string; date: string; file_url?: string }) => {
        if (!bookingId) return;

        try {
            // Download PDF from backend (generated on-the-fly)
            await apiClient.downloadRemedyPDF(bookingId, pdf.name);
        } catch (error) {
            console.error('Failed to download PDF:', error);
            alert('Failed to download PDF. Please try again.');
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
