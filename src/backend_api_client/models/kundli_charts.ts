import { IsString } from 'class-validator';

export class KundliCharts {
    @IsString()
    birth!: string;     // d1

    @IsString()
    d2!: string;

    @IsString()
    d3!: string;

    @IsString()
    d4!: string;

    @IsString()
    d7!: string;

    @IsString()
    navamsha!: string; // d9

    @IsString()
    dashamsha!: string; // d10

    @IsString()
    d12!: string;

    @IsString()
    d16!: string;

    @IsString()
    d20!: string;

    @IsString()
    d24!: string;

    @IsString()
    d27!: string;

    @IsString()
    d30!: string;

    @IsString()
    d40!: string;

    @IsString()
    d45!: string;

    @IsString()
    d60!: string;

    @IsString()
    chalit!: string;   // chalit

    @IsString()
    moon!: string;     // moon

    @IsString()
    sun!: string;      // sun

    @IsString()
    cuspal!: string;   // cuspal
}
