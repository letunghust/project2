import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { AnswerKey } from 'src/types/AnswerKey.type';
import { Position } from 'src/types/Position.type';

export class DoQuizDto {
    @ValidateNested()
    @Type(() => Position)
    position: Position;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AnswerKey)
    answers: AnswerKey[];
}
