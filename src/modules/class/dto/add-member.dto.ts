import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AddMemberDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;

    @Type(() => Number)
    @IsNumber()
    userId: number;
}
