import { IsNumber, IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserSummary {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;
}

export class SitemapInfo {
    @IsString()
    name!: string;

    @IsString()
    url!: string;

    @IsDateString()
    createdAt!: string;
}

export class ReportInfo {
    @IsString()
    name!: string;

    @IsString()
    url!: string;

    @IsOptional()
    @IsDateString()
    createdAt!: string | null;
}

export class UserSitemap {
    @IsNumber()
    userLocationId!: number;

    @IsString()
    locationName!: string;

    @ValidateNested()
    @Type(() => UserSummary)
    user!: UserSummary;

    @ValidateNested()
    @Type(() => SitemapInfo)
    sitemap!: SitemapInfo;

    @ValidateNested()
    @Type(() => ReportInfo)
    report!: ReportInfo;
}
