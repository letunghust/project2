import { UserService } from './../../user/user.service';
import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards, Param, Patch, Put } from '@nestjs/common';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { roles as roles } from 'src/constants/accountRoles.constant';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRequest } from 'src/modules/auth/dto/auth.dto';
import { CheckAttendance, GetListMembersDto } from '../dto/query-member.dto';
import { AddMemberDto } from '../dto/add-member.dto';
import { RemoveMembersDto } from '../dto/remove-member.dto';
import { MemberService } from '../member.service';
import { IdParam, QueryDto } from '../../../utils/common-dto.util';
import { AcceptStudentDto } from '../dto/accept-student.dto';

@Controller('teacher/members')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class MemberTeacherController {
    constructor(private memberService: MemberService, private userService: UserService) {}

    @Get('/users')
    async getListUsers(@Query() query: QueryDto) {
        return this.userService.getListUsers(query);
    }

    @Get('/')
    async getListMembers(@Query() query: GetListMembersDto) {
        return this.memberService.getMembers(query);
    }

    @Post('/')
    async addMemberToClass(@Req() { user }: UserRequest, @Body() body: AddMemberDto) {
        return this.memberService.addMemberToClass(user.id, body);
    }

    @Delete('/')
    async removeMembersFromClass(@Req() { user }: UserRequest, @Body() body: RemoveMembersDto) {
        return this.memberService.removeMembersFromClass(user.id, body);
    }

    @Get('/check')
    async checkAttendance(@Query() query: CheckAttendance) {
        return this.memberService.checkAttendance(query);
    }

    @Put('/')
    async acceptStudent(@Req() { user }: UserRequest, @Body() body: AcceptStudentDto) {
        return this.memberService.acceptStudent(user.id, body);
    }
}
