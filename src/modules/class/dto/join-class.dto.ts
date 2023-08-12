import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class JoinClassDto {
    @Type(() => Number)
    @IsNumber()
    classNumber: number;
}
