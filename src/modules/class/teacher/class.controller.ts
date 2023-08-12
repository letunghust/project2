import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { ClassService } from '../class.service';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { roles as roles } from 'src/constants/accountRoles.constant';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRequest } from 'src/modules/auth/dto/auth.dto';
import { IdParam, IdsDto, QueryDto } from 'src/utils/common-dto.util';

@Controller('teacher/classes')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class ClassTeacherController {
    constructor(private classService: ClassService) {}

    @Get('/')
    async getListClassesOfTeacher(@Req() { user }: UserRequest, @Query() query: QueryDto) {
        return this.classService.getListClassesOfTeacher(user.id, query);
    }

    @Get('/:id')
    async getClassOfTeacherById(@Req() { user }: UserRequest, @Param() { id }: IdParam) {
        return this.classService.getClassOfTeacherById(user.id, id);
    }

    @Post('/')
    async createClass(@Req() { user }: UserRequest, @Body() body: CreateClassDto) {
        return this.classService.createClass(user.id, body);
    }

    @Put('/:id')
    async updateClass(@Req() { user }: UserRequest, @Param() { id }: IdParam, @Body() body: UpdateClassDto) {
        return this.classService.updateClass(user.id, id, body);
    }

    @Delete('/')
    async deleteClasses(@Req() { user }: UserRequest, @Body() body: IdsDto) {
        return this.classService.deleteClasses(user.id, body);
    }
}
