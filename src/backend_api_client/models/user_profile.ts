import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfile {
    @IsNumber()
    id!: number;

    @IsNumber()
    userId!: number;

    @IsString()
    name!: string;

    @IsString()
    gender!: string;

    @Type(() => Date)
    dateTimeOfBirth!: Date;

    @IsString()
    placeOfBirth!: string;

    @IsNumber()
    timezoneOffset!: number;

    @IsNumber()
    lat!: number;

    @IsNumber()
    lon!: number;

    @IsBoolean()
    isDefault!: boolean;

    @IsString()
    sunSign!: string;

    @IsString()
    moonSign!: string;
}

