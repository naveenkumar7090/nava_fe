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
    constructor(baseURL: string = "http://127.0.0.1:3000", authToken: string = "admin_access_token") {
        this.client = axios.create({
            baseURL,
            headers: {
                'auth-token': authToken
            }
        });
    }

    // ==================== Consultation Endpoints ====================

    async getAdminBookings(limit: number = 20, next: number = 0, staffId?: string): Promise<{ bookings: Booking[], next: number }> {
        const params: any = { limit, next };
        if (staffId) {
            params.staffId = staffId;
        }

        try {
            const response = await this.client.get('/admin/consultation/bookings', { params });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
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
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch locations for user ${userId}:`, error);
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
}

