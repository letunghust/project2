import { Controller, UseGuards, Delete, Body, Req, Put, Get } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequest } from '../auth/dto/auth.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    async getUserById(@Req() { user }: UserRequest) {
        return await this.userService.getUserById(user.id);
    }
    @Put('/')
    async updateUser(@Req() { user }: UserRequest, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(user, body);
    }

    @Delete('/')
    async deleteUser(@Req() { user }: UserRequest) {
        return this.userService.deleteUser(user);
    }
}
