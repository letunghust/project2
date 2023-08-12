import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AcceptStudentDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;

    @Type(() => Number)
    @IsNumber()
    studentId: number;
}
