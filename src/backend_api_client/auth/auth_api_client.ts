import { AxiosInstance } from "axios";
import { LoginResponse, AdminUser } from "../models/admin_user";
import { plainToInstance } from "class-transformer";

export class AuthApiClient {
    constructor(private readonly client: AxiosInstance) { }

    /**
     * Login to the admin dashboard
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await this.client.post('/admin/auth/login', { email, password });
            return plainToInstance(LoginResponse, response.data.data);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    /**
     * Get current logged in user details
     */
    async getMe(): Promise<AdminUser> {
        try {
            const response = await this.client.get('/admin/auth/me');
            return plainToInstance(AdminUser, response.data);
        } catch (error) {
            console.error("Failed to fetch 'me' data:", error);
            throw error;
        }
    }

    /**
     * Assign a password to a Zoho staff member
     */
    async assignPassword(staffId: string, password: string): Promise<AdminUser> {
        try {
            const response = await this.client.post('/admin/auth/assign-password', {
                staffId,
                password
            });
            return plainToInstance(AdminUser, response.data.data);
        } catch (error) {
            console.error("Failed to assign password:", error);
            throw error;
        }
    }
}