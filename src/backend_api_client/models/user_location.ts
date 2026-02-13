import { IsNumber, IsOptional, IsString, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserLocationSpace {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsString()
    direction!: string;

    @IsNumber()
    bearing!: number;
}

export class UserLocationFloor {
    @IsNumber()
    id!: number;

    @IsNumber()
    userLocationId!: number;

    @IsNumber()
    vastuScore!: number;

    @IsNumber()
    floorNumber!: number;

    @IsString()
    status!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserLocationSpace)
    space!: UserLocationSpace[];

    @IsOptional()
    data?: any; // Vastu report data
}

export class UserLocation {
    @IsNumber()
    id!: number;

    @IsNumber()
    locationId!: number;

    @IsString()
    locationName!: string;

    @IsOptional()
    @IsString()
    buildingType!: string | null;

    @IsOptional()
    @IsString()
    layout!: string | null;

    @IsString()
    scanningMethod!: string;

    @IsNumber()
    vastuScore!: number;

    @IsString()
    status!: string;

    @IsNumber()
    floorCount!: number;

    @Type(() => Date)
    @IsDate()
    createdAt!: Date;

    @IsOptional()
    @ValidateNested()
    @Type(() => Object) // Simplified for nested object with just name
    location!: {
        name: string;
    };

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserLocationFloor)
    floors!: UserLocationFloor[];

    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    sitemap?: {
        id: number;
        sitemapPdf: string;
        reportPdf: string;
    };

    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    userLocationMap?: {
        id: number;
    };
}


