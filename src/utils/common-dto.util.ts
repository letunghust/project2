import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IdParam {
    @Type(() => Number)
    @IsNumber()
    public id: number;
}

export class QueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    public take?: number; // page_size

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    public skip?: number; // (page-1) * page_size

    @IsOptional()
    @IsString()
    public search?: string;
}

export class IdsDto {
    @Type(() => Number)
    @IsNumber({}, { each: true })
    public ids: number[];
}

export class GetListQueryByClassId extends QueryDto {
    @IsNumber()
    public classId: number;
}
