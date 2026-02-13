import { IsString, IsOptional } from 'class-validator';

export class RemedyData {
    @IsOptional()
    @IsString()
    problems?: string;

    @IsOptional()
    @IsString()
    diagnosis?: string;

    @IsOptional()
    @IsString()
    suggestions?: string;

    @IsOptional()
    @IsString()
    products?: string;

    @IsOptional()
    @IsString()
    reminders?: string;
}

