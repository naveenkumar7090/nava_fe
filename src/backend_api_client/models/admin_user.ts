import { IsNumber, IsOptional, IsString, IsEnum, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export type AdminRole = 'superadmin' | 'admin' | 'consultant' | 'content_creator';

export class AdminUser {
    @IsNumber()
    id!: number;

    @IsString()
    email!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsString()
    role!: AdminRole;

    @IsOptional()
    @IsString()
    zohoStaffId!: string | null;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    lastLogin?: Date;
}

export class LoginResponse {
    @IsString()
    token!: string;

    @ValidateNested()
    @Type(() => AdminUser)
    user!: AdminUser;
}