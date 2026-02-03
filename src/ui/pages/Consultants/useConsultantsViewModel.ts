import { useState, useEffect, useRef } from 'react';
import { StaffMember } from './Consultants';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';

export const useConsultantsViewModel = () => {
    const backendApiClient = useRef(container.resolve(BackendApiClient)).current;

    const [staffData, setStaffData] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    experience_years: undefined, // Not available in current API
                    total_bookings: 0, // Placeholder
                    avg_rating: 0, // Placeholder
                    total_commission: 0, // Placeholder
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
    }, []);

    return {
        staffData,
        loading,
        error
    };
};
