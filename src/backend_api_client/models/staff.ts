import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class StaffMember {
    @IsString()
    id!: string;

    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsOptional()
    @IsString()
    designation?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    contact_number?: string;

    @IsOptional()
    @IsString()
    photo?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    assigned_services?: string[];

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    total_bookings?: number;

    @IsOptional()
    @IsNumber()
    avg_rating?: number;

    @IsOptional()
    @IsNumber()
    total_commission?: number;

    @IsOptional()
    @IsString()
    additional_information?: string;
}

export class StaffResponse {
    data!: {
        response: {
            returnvalue: {
                data: StaffMember[];
            };
        };
    };
}

