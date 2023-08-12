import { IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/utils/trim.util';

export class UpdateUserDto {
    @IsOptional()
    @Trim()
    @IsString()
    fisrtName: string;

    @IsOptional()
    @Trim()
    @IsString()
    lastName: string;

    @IsOptional()
    @Trim()
    @IsString()
    // @Matches(/\d+/)
    number: string;
}
