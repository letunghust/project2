// import { PartialType } from '@nestjs/mapped-types';
// import { CreateClassDto } from './create-class.dto';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/utils/trim.util';

export class UpdateClassDto {
    @IsOptional()
    @IsString()
    @Trim()
    name: string;

    @IsOptional()
    @IsString()
    @Trim()
    description: string;

    @IsOptional()
    @IsNumber()
    classNumber: number;

    @IsOptional()
    @IsString()
    joinCode: string;

    @IsOptional()
    @IsBoolean()
    requirePermission: boolean;
}
