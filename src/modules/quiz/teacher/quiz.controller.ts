import { IdParam, IdsDto } from '../../../utils/common-dto.util';
import { UserRequest } from '../../auth/dto/auth.dto';
import { QuizService } from '../quiz.service';
import { roles } from '../../../constants/accountRoles.constant';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { GetListQuizzesDto } from '../dto/query-quiz.dto';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';

@Controller('teacher/quizzes')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class QuizTeacherController {
    constructor(private quizService: QuizService) {}

    @Get('/')
    async getListQuizzesOfClass(@Req() { user }: UserRequest, @Query() query: GetListQuizzesDto) {
        return this.quizService.getListQuizzesOfClass(user.id, query);
    }

    @Get('/:id')
    async getQuizWithKeyById(@Req() { user }: UserRequest, @Param() { id }: IdParam) {
        return this.quizService.getQuizWithKeyById(user.id, id);
    }

    @Post('/')
    async createQuiz(@Req() { user }: UserRequest, @Body() body: CreateQuizDto) {
        return this.quizService.createQuiz(user.id, body);
    }

    @Put('/:id')
    async updateQuiz(@Req() { user }: UserRequest, @Param() { id }: IdParam, @Body() body: UpdateQuizDto) {
        return this.quizService.updateQuiz(user.id, id, body);
    }

    @Delete('/')
    async deleteQuizzes(@Req() { user }: UserRequest, @Body() body: IdsDto) {
        return this.quizService.deleteQuizzes(user.id, body);
    }
}
