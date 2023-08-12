import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { Answer } from './Answer.type';

export class AnswerKey {
    @IsNumber()
    questionId: number;

    @ValidateNested({ each: true })
    @Type(() => Answer)
    answers: Answer[];
}
