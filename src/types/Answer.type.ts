import { IsNumber, IsString } from 'class-validator';

export class Answer {
    @IsNumber()
    answerId: number;

    @IsString()
    label: string;
}
