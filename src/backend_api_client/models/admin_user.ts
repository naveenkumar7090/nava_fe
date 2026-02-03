export type AdminRole = 'superadmin' | 'admin' | 'consultant' | 'content_creator';

export interface AdminUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
    zohoStaffId: string | null;
    avatar?: string;
    lastLogin?: string;
}

export interface LoginResponse {
    token: string;
    user: AdminUser;
}