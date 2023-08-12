import { IsNumber } from 'class-validator';
import { QueryDto } from '../../../utils/common-dto.util';
import { Type } from 'class-transformer';
export class GetListQuizzesDto extends QueryDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}
