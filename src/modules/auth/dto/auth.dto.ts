import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/database/entities/user.entity';
import { Trim } from 'src/utils/trim.util';

export interface UserRequest extends Request {
    user: User;
}

export class LoginDto {
    @Trim()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}
