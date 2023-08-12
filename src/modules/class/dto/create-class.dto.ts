import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/utils/trim.util';

export class CreateClassDto {
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(255)
    public name: string;

    @IsOptional()
    @IsString()
    @Trim()
    public description: string;

    @IsOptional()
    @IsString()
    @Trim()
    public joinCode: string;

    // @Matches(/\d{6}/)
    @IsNumber()
    public classNumber: number;

    @IsOptional()
    @IsBoolean()
    requirePermission: boolean;
}
