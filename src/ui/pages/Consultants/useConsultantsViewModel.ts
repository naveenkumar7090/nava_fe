import { useState, useEffect, useRef, useMemo } from 'react';
import { StaffMember } from './Consultants';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';

export const useConsultantsViewModel = () => {
    const backendApiClient = useRef(container.resolve(BackendApiClient)).current;

    const [staffData, setStaffData] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Password Dialog State
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await backendApiClient.getConsultants();

                // Transform the data to match StaffMember interface
                const transformedStaff: StaffMember[] = Array.isArray(data) ? data.map((staff: any) => ({
                    staff_id: staff.id,
                    staff_name: staff.name || 'Unknown',
                    staff_email: staff.email || '',
                    staff_designation: staff.designation || '',
                    staff_contact_number: staff.phone || staff.contact_number || '',
                    additional_information: staff.additional_information || '',
                    photo: staff.photo || '',
                    assigned_services: staff.assigned_services || [],
                    status: staff.status as 'Active' | 'Inactive' || 'Active',
                    type: staff.consultationTypes && staff.consultationTypes.length > 0
                        ? (staff.consultationTypes.includes('astro') ? 'Astro' : 'Vastu')
                        : 'Vastu'
                })) : [];

                setStaffData(transformedStaff);
            } catch (err: any) {
                console.error('Error fetching staff data:', err);
                setError('Failed to fetch staff data. Please check your connection.');
                setStaffData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, [backendApiClient]);

    // Handlers
    const handleOpenPasswordDialog = (staff: StaffMember) => {
        setSelectedStaff(staff);
        setNewPassword('');
        setPasswordDialogOpen(true);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        setSelectedStaff(null);
        setNewPassword('');
        setShowPassword(false);
    };

    const handleSetPassword = async () => {
        if (!selectedStaff || !newPassword) return;

        setIsSubmitting(true);
        try {
            await backendApiClient.auth.assignPassword(
                selectedStaff.staff_id,
                newPassword
            );

            setSnackbar({
                open: true,
                message: `Password successfully set for ${selectedStaff.staff_name}`,
                severity: 'success'
            });
            handleClosePasswordDialog();
        } catch (err: any) {
            console.error('Failed to set password:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to set password',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Derived State
    const filteredStaff = useMemo(() => {
        return staffData.filter((staff) => {
            const matchesSearch = staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.staff_designation?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All Types' || staff.type === typeFilter;
            const matchesStatus = statusFilter === 'All Status' || staff.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [staffData, searchTerm, typeFilter, statusFilter]);

    const statistics = useMemo(() => {
        const totalConsultants = staffData.length;
        const activeConsultants = staffData.filter(staff => staff.status === 'Active').length;

        return {
            totalConsultants,
            activeConsultants,
        };
    }, [staffData]);

    return {
        // Data
        staffData,
        filteredStaff,
        statistics,
        loading,
        error,

        // Filters State & Setters
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,

        // Password Dialog State & Setters
        passwordDialogOpen,
        selectedStaff,
        newPassword,
        setNewPassword,
        showPassword,
        setShowPassword,
        isSubmitting,
        snackbar,

        // Handlers
        handleOpenPasswordDialog,
        handleClosePasswordDialog,
        handleSetPassword,
        handleCloseSnackbar
    };
};
