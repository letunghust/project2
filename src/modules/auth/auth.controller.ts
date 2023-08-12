import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChangePasswordDto, LoginDto } from './dto/auth.dto';
import { UserRequest } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Post('/register')
    async register(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @Post('/login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @Get('/refresh-token')
    @UseGuards(RolesGuard)
    async refreshToken(@Req() { user }: UserRequest) {
        return this.authService.refreshAccessToken(user);
    }

    @Post('/change-password')
    @UseGuards(RolesGuard)
    async changePassword(@Req() { user }: UserRequest, @Body() { oldPassword, newPassword }: ChangePasswordDto) {
        return this.authService.changePassword(user, oldPassword, newPassword);
    }
}
