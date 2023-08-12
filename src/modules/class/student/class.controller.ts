import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards, Body } from '@nestjs/common';
import { roles } from 'src/constants/accountRoles.constant';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ClassService } from '../class.service';
import { UserRequest } from 'src/modules/auth/dto/auth.dto';
import { IdParam, QueryDto } from 'src/utils/common-dto.util';
import { JoinClassDto } from '../dto/join-class.dto';

@Controller('student/classes')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class ClassStudentController {
    constructor(private classService: ClassService) {}

    @Get('/')
    async getListClassesByStudent(@Req() { user }: UserRequest, @Query() query: QueryDto) {
        return this.classService.getListClassesByStudent(user.id, query);
    }

    @Delete('/:id')
    async leaveClass(@Req() { user }: UserRequest, @Param() { id }: IdParam) {
        return this.classService.leaveClass(user.id, id);
    }

    @Post('/join')
    async joinClass(@Req() { user }: UserRequest, @Body() body: JoinClassDto) {
        return this.classService.joinClass(user.id, body);
    }
}
