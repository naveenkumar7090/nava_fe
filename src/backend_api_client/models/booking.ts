import { IsNumber, IsOptional, IsString, IsEnum, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BookingAccount {
    @IsNumber()
    userId!: number;

    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsOptional()
    @IsString()
    mobile!: string | null;
}

export class BookingProfile {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateTimeOfBirth?: Date;

    @IsOptional()
    @IsString()
    placeOfBirth?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    sunSign?: string;

    @IsOptional()
    @IsString()
    moonSign?: string;
}

export class BookingLocation {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;
}

export class BookingService {
    @IsString()
    id!: string;

    @IsString()
    name!: string;
}

export class BookingStaff {
    @IsString()
    id!: string;

    @IsString()
    name!: string;
}

export class Booking {
    @IsNumber()
    id!: number;

    @IsString()
    bookingId!: string;

    @IsString()
    consultationType!: 'astro' | 'vastu';

    @ValidateNested()
    @Type(() => BookingAccount)
    account!: BookingAccount;

    @IsOptional()
    @ValidateNested()
    @Type(() => BookingProfile)
    profile!: BookingProfile | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => BookingLocation)
    location!: BookingLocation | null;

    @ValidateNested()
    @Type(() => BookingService)
    service!: BookingService;

    @ValidateNested()
    @Type(() => BookingStaff)
    staff!: BookingStaff;

    @Type(() => Date)
    @IsDate()
    createdAt!: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    scheduledStartTime!: Date | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    scheduledEndTime!: Date | null;

    @IsString()
    duration!: string;

    @IsString()
    status!: string;

    @IsString()
    email!: string;

    @IsString()
    preferredLanguage!: string;

    @IsOptional()
    @IsString()
    topicOfDiscussion!: string | null;

    @IsOptional()
    @IsString()
    detailedTopicOfDiscussion!: string | null;

    @IsOptional()
    @IsNumber()
    rating!: number | null;

    @IsOptional()
    @IsString()
    meetingLink!: string | null;

    @IsOptional()
    @IsNumber()
    price!: number | null;

    @Type(() => Date)
    @IsDate()
    updatedAt!: Date;
}


export enum BookingStatus {
    upcoming = "upcoming",
    ongoing = "ongoing",
    yet_to_mark = "yet_to_mark",
    cancelled = "cancelled",
    completed = "completed",
    no_show = "no_show",
}

function isBookingStatus(value: string): value is BookingStatus {
    return Object.values(BookingStatus).includes(value as BookingStatus);
}

export function parseBookingStatus(value: string): BookingStatus {
    if (!isBookingStatus(value)) {
        throw new Error(`Cannot parse ${value} to booking status`);
    }

    return value as BookingStatus;
}