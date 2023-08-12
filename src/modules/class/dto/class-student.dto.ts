import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ClassStudentDto {
    @IsNumber()
    classId: number;

    @IsNumber()
    studentId: number;

    @IsOptional()
    @IsBoolean()
    hidden: boolean;

    @IsOptional()
    @IsBoolean()
    waiting: boolean;
}
