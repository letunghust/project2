import { IdsDto } from './../../../utils/common-dto.util';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class RemoveMembersDto extends IdsDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}
