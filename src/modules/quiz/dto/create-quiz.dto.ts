import { AnswerKey } from './../../../types/AnswerKey.type';
import { Question } from './../../../types/Question.type';
import { Position } from './../../../types/Position.type';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateQuizDto {
    @IsNumber()
    classId: number;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Position)
    position: Position;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    closeTime: Date;

    @IsOptional()
    @IsNumber()
    status: number;

    @ValidateNested({ each: true })
    @Type(() => Question)
    questions: Question[];

    @ValidateNested({ each: true })
    @Type(() => AnswerKey)
    key: AnswerKey[];
}
