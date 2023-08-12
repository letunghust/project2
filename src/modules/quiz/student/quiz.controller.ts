import { IdParam } from '../../../utils/common-dto.util';
import { UserRequest } from '../../auth/dto/auth.dto';
import { roles } from '../../../constants/accountRoles.constant';
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { QuizService } from '../quiz.service';
import { GetListQuizzesDto } from '../dto/query-quiz.dto';
import { DoQuizDto } from '../dto/do-quiz.dto';

@Controller('student/quizzes')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class QuizStudentController {
    constructor(private quizService: QuizService) {}

    @Get('/')
    async getListQuizzes(@Req() { user }: UserRequest, @Query() query: GetListQuizzesDto) {
        return this.quizService.getListQuizzesOfClassStudent(user.id, query);
    }

    @Get('/:id')
    async getQuizById(@Req() { user }: UserRequest, @Param() { id }: IdParam) {
        return this.quizService.getQuizByIdStudent(user.id, id);
    }

    @Post('/:id')
    async doQuiz(@Req() { user }: UserRequest, @Param() { id }: IdParam, @Body() body: DoQuizDto) {
        return this.quizService.doQuiz(user.id, id, body);
    }
}
