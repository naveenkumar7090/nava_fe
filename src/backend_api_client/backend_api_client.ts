import axios, { AxiosInstance } from "axios";
import { Booking } from "./models/booking";
import { Account } from "./models/account";
import { UserProfile } from "./models/user_profile";
import { UserLocation } from "./models/user_location";
import { UpdateRemedyData } from "./models/update_remedy_options";
import { RemedyData } from "./models/remedy_data";

export class BackendApiClient {
    private client: AxiosInstance;

    // Defaulting to localhost:3000 as that is likely where the local backend is running
    constructor(baseURL: string = "http://localhost:3000", authToken: string = "admin_access_token") {
        // constructor(baseURL: string = "http://13.235.0.135:3000", authToken: string = "admin_access_token") {
        this.client = axios.create({
            baseURL,
            headers: {
                'auth-token': authToken
            }
        });
    }

    // ==================== Consultation Endpoints ====================

    async getAdminBookings(limit: number = 20, next: number = 0, staffId?: string, profileId?: number): Promise<{ bookings: Booking[], next: number }> {
        const params: any = { limit, next };
        if (staffId) {
            params.staffId = staffId;
        }
        if (profileId) {
            params.profileId = profileId;
        }

        try {
            const response = await this.client.get('/admin/consultation/bookings', { params });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            throw error;
        }
    }

    async getStaffDetails(staffId: string): Promise<any> {
        try {
            const response = await this.client.get(`/admin/consultation/staff/${staffId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch staff details for ${staffId}:`, error);
            throw error;
        }
    }

    async getConsultants(): Promise<any[]> {
        try {
            const response = await this.client.get('/admin/consultation/staff');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch consultants:", error);
            throw error;
        }
    }

    /**
     * Get a specific booking by ID (Admin)
     */
    async getAdminBooking(bookingId: number): Promise<Booking> {
        try {
            const response = await this.client.get(`/admin/consultation/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch booking ${bookingId}:`, error);
            throw error;
        }
    }

    /**
     * Update status of a booking (Admin)
     */
    async updateBookingStatus(bookingId: number, status: 'completed' | 'cancel' | 'noshow'): Promise<void> {
        try {
            await this.client.put(`/admin/consultation/bookings/${bookingId}/status`, { status });
        } catch (error) {
            console.error(`Failed to update booking status ${bookingId}:`, error);
            throw error;
        }
    }

    /**
     * Get available slots for rescheduling
     */
    async getBookingSlots(bookingId: number, date: string): Promise<{ slots: Date[] }> {
        try {
            const response = await this.client.get(`/admin/consultation/bookings/${bookingId}/slots`, { params: { date } });
            // API returns ISO strings, client might want Dates
            // Although here we assume the backend returns what we need.
            // Based on backend implementation NewConsultationService.getSlotsForBooking -> return { slots }
            // and ZohoService.getAppointmentSlots -> return Date[]
            // So response.data.slots will be strings (ISO) over JSON.
            return {
                slots: response.data.slots.map((s: string) => new Date(s))
            };
        } catch (error) {
            console.error(`Failed to fetch slots for booking ${bookingId}:`, error);
            throw error;
        }
    }

    /**
     * Reschedule a booking
     */
    async rescheduleBooking(bookingId: number, startTime: string): Promise<void> {
        try {
            await this.client.put(`/admin/consultation/bookings/${bookingId}/reschedule`, { startTime });
        } catch (error) {
            console.error(`Failed to reschedule booking ${bookingId}:`, error);
            throw error;
        }
    }

    // ==================== Account Endpoints ====================

    /**
     * Get all user accounts
     */
    async getAllAccounts(): Promise<Account[]> {
        try {
            const response = await this.client.get('/admin/account/users');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch all accounts:", error);
            throw error;
        }
    }

    /**
     * Get a specific account by user ID
     */
    async getAccountById(userId: number): Promise<Account> {
        try {
            const response = await this.client.get(`/admin/account/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch account ${userId}:`, error);
            throw error;
        }
    }

    // ==================== UserProfile Endpoints ====================

    /**
     * Get all profiles for a specific user
     * @param userId - The user ID
     * @param includeDefault - Whether to include the default profile
     */
    async getUserProfiles(userId: number, includeDefault: boolean = false): Promise<{ profiles: UserProfile[] }> {
        try {
            const params = includeDefault ? { with_default: 'true' } : {};
            const response = await this.client.get(`/admin/userprofile/users/${userId}/profiles`, { params });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch profiles for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get a specific user profile
     * @param userId - The user ID
     * @param profileId - The profile ID or 'default' for default profile
     */
    async getUserProfile(userId: number, profileId: number | 'default'): Promise<UserProfile> {
        try {
            const response = await this.client.get(`/admin/userprofile/users/${userId}/profiles/${profileId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch profile ${profileId} for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get profiles by ID only
     */
    async getProfileById(profileId: number): Promise<UserProfile> {
        try {
            const response = await this.client.get(`/admin/userprofile/profiles/${profileId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch profile ${profileId}:`, error);
            throw error;
        }
    }

    // ==================== Location Endpoints ====================

    /**
     * Get all locations for a specific user
     */
    async getUserLocations(userId: number, limit: number = 20, next: number = 0): Promise<UserLocation[]> {
        const params = { limit, next };
        try {
            const response = await this.client.get(`/admin/location/users/${userId}`, { params });
            // Handle both array response and wrapped response
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data?.locations && Array.isArray(response.data.locations)) {
                return response.data.locations;
            }
            console.warn('Unexpected response format for getUserLocations:', response.data);
            return [];
        } catch (error) {
            console.error(`Failed to fetch locations for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get a specific user location by ID
     */
    async getUserLocationById(id: number): Promise<UserLocation> {
        console.log(`Fetching user location by ID: ${id}`, this.client);
        try {
            const response = await this.client.get(`/admin/location/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch user location ${id}:`, error);
            throw error;
        }
    }
    // ==================== Remedy Endpoints ====================

    /**
     * Update remedy data for a consultation
     */
    async updateRemedyData(consultationId: number, opts: UpdateRemedyData): Promise<void> {
        const response = await this.client.put(`/admin/consultation/${consultationId}/remedy`, opts);
        return response.data;
    }

    /**
     * Get remedy data for a consultation
     */
    async getRemedyPDF(consultationId: number): Promise<RemedyData> {
        const response = await this.client.get(`/admin/consultation/${consultationId}/remedy/pdf`);
        return response.data;
    }

    /**
     * Get list of saved remedy PDFs for a consultation
     */
    async getSavedRemedyPDFs(consultationId: number): Promise<Array<{ id: number; name: string; date: string; file_url?: string }>> {
        try {
            const response = await this.client.get(`/admin/consultation/${consultationId}/remedy/pdfs`);
            // Handle different response structures
            if (response.data?.remedies) {
                return response.data.remedies.map((remedy: any) => ({
                    id: remedy.id,
                    name: remedy.file_name || remedy.name || `remedy_${remedy.id}.pdf`,
                    date: remedy.updated_at || remedy.created_at || new Date().toISOString(),
                    file_url: remedy.file_url || `/admin/consultation/${consultationId}/remedy/pdf/${remedy.id}`
                }));
            } else if (Array.isArray(response.data)) {
                return response.data.map((remedy: any) => ({
                    id: remedy.id,
                    name: remedy.file_name || remedy.name || `remedy_${remedy.id}.pdf`,
                    date: remedy.updated_at || remedy.created_at || new Date().toISOString(),
                    file_url: remedy.file_url || `/admin/consultation/${consultationId}/remedy/pdf/${remedy.id}`
                }));
            }
            return [];
        } catch (error) {
            console.error(`Failed to fetch saved PDFs for consultation ${consultationId}:`, error);
            // Return empty array if no PDFs found (404 is expected for consultations without saved PDFs)
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return [];
            }
            throw error;
        }
    }

    /**
     * Download a remedy PDF file
     */
    async downloadRemedyPDF(consultationId: number, pdfId: number, fileName: string): Promise<void> {
        try {
            const response = await this.client.get(`/admin/consultation/${consultationId}/remedy/pdf/${pdfId}`, {
                responseType: 'blob'
            });

            // Create blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Failed to download PDF ${pdfId} for consultation ${consultationId}:`, error);
            throw error;
        }
    }

    // ==================== Location Map PDF Endpoints ====================

    /**
     * Upload a map PDF file directly to the database
     */
    async uploadMapPdf(userLocationId: number, file: File): Promise<{
        id: number;
        fileName: string;
        fileSize: number;
        mimeType: string;
        createdAt: string;
        updatedAt: string;
    }> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await this.client.post(`/admin/location/${userLocationId}/map/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to upload map PDF for location ${userLocationId}:`, error);
            throw error;
        }
    }

    /**
     * Get all map PDFs for a user location
     */
    async getMapPdfs(userLocationId: number): Promise<Array<{
        id: number;
        fileName: string;
        fileSize: number;
        mimeType: string;
        createdAt: string;
        updatedAt: string;
        downloadUrl: string;
    }>> {
        try {
            const response = await this.client.get(`/admin/location/${userLocationId}/maps`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch map PDFs for location ${userLocationId}:`, error);
            throw error;
        }
    }

    /**
     * Download a map PDF file
     */
    async downloadMapPdf(userLocationId: number, mapId: number, fileName: string): Promise<void> {
        try {
            const response = await this.client.get(`/admin/location/${userLocationId}/map/${mapId}`, {
                responseType: 'blob'
            });

            // Create blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Failed to download map PDF ${mapId} for location ${userLocationId}:`, error);
            throw error;
        }
    }
}

export const backendApiClient = new BackendApiClient(process.env.REACT_APP_API_URL || 'http://localhost:3000');

