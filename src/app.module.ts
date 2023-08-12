import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './database/orm.config';
import { entities } from './database';
import { UserController } from './modules/user/user.controller';
import { ClassTeacherController } from './modules/class/teacher/class.controller';
import { ClassStudentController } from './modules/class/student/class.controller';
import { UserService } from './modules/user/user.service';
import { ClassService } from './modules/class/class.service';
import { AuthController } from './modules/auth/auth.controller';
import { QuizTeacherController } from './modules/quiz/teacher/quiz.controller';
import { QuizStudentController } from './modules/quiz/student/quiz.controller';
import { QuizService } from './modules/quiz/quiz.service';
import { MemberService } from './modules/class/member.service';
import { MemberTeacherController } from './modules/class/teacher/member.controller';
import { MemberStudentController } from './modules/class/student/member.controller';
@Module({
    imports: [AuthModule, ConfigModule.forRoot(), TypeOrmModule.forRoot(options), TypeOrmModule.forFeature(entities)],
    controllers: [
        AuthController,
        UserController,
        ClassTeacherController,
        ClassStudentController,
        MemberTeacherController,
        MemberStudentController,
        QuizTeacherController,
        QuizStudentController,
    ],
    providers: [UserService, ClassService, QuizService, MemberService],
})
export class AppModule {}
