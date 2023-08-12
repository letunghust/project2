import { AnswerKey } from './../../../types/AnswerKey.type';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Position } from 'src/types/Position.type';
import { Question } from 'src/types/Question.type';

export class UpdateQuizDto {
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

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Question)
    questions: Question[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AnswerKey)
    key: AnswerKey[];
}
