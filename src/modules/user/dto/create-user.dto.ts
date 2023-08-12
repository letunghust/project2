import { IsEmail, IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { roles } from 'src/constants/accountRoles.constant';
import { Trim } from 'src/utils/trim.util';

export class CreateUserDto {
    @IsEmail()
    @Trim()
    email: string;

    @IsString()
    password: string;

    @Trim()
    @IsString()
    firstName: string;

    @Trim()
    @IsString()
    lastName: string;

    @IsIn(Object.values(roles).map((e) => e.value))
    role: number;

    @IsOptional()
    @Trim()
    @IsString()
    @Matches(/\d+/)
    number: string;
}
