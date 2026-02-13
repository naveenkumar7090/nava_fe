import { IsString } from 'class-validator';

export class KundliCharts {
    @IsString()
    birth!: string;     // d1

    @IsString()
    navamsha!: string; // d9

    @IsString()
    chalit!: string;   // chalit

    @IsString()
    moon!: string;     // moon

    @IsString()
    sun!: string;      // sun

    @IsString()
    dashamsha!: string; // d10
}
