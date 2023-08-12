import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Answer } from './Answer.type';
import { Type } from 'class-transformer';
// import { AnswerKey } from './AnswerKey.type';
export class Question {
    @IsNumber()
    questionId: number;

    @IsString()
    label: string;

    @ValidateNested({ each: true })
    @Type(() => Answer)
    answers: Answer[];

    // @ValidateNested({ each: true })
    // @Type(() => AnswerKey)
    // key: AnswerKey[];
}
