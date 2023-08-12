import { QueryDto } from './../../../utils/common-dto.util';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetListMembersDto extends QueryDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}

export class CheckAttendance extends GetListMembersDto {
    @Type(() => Number)
    @IsNumber()
    userId: number;
}
