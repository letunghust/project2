import { IsNumber } from 'class-validator';

export class Position {
    @IsNumber()
    lat: number;

    @IsNumber()
    long: number;
}
