import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { roles as roles } from 'src/constants/accountRoles.constant';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { GetListMembersDto } from '../dto/query-member.dto';
import { MemberService } from '../member.service';

@Controller('student/classes/members')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class MemberStudentController {
    constructor(private memberService: MemberService) {}

    @Get('/')
    async getListMembers(@Query() query: GetListMembersDto) {
        return this.memberService.getMembers(query);
    }
}
