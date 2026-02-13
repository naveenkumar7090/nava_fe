import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SunSign {
    @IsString()
    name!: string;

    @IsString()
    image!: string;

    @IsOptional()
    data: any;
}

export class MoonSign {
    @IsString()
    name!: string;

    @IsString()
    image!: string;

    @IsOptional()
    data: any;
}

export class Account {
    @IsNumber()
    id!: number;

    @IsOptional()
    @IsString()
    email!: string | null;

    @IsOptional()
    @IsString()
    mobile!: string | null;

    @IsString()
    name!: string;

    @IsString()
    gender!: string;

    @Type(() => Date)
    dateTimeOfBirth!: Date;

    @IsString()
    placeOfBirth!: string;

    @IsString()
    timezoneOffset!: string;

    @IsNumber()
    lat!: number;

    @IsNumber()
    lon!: number;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SunSign)
    sunSign?: SunSign;

    @IsOptional()
    @ValidateNested()
    @Type(() => MoonSign)
    moonSign?: MoonSign;
}

