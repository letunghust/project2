import { errors } from './../../constants/message.constant';
import { roles as roles } from './../../constants/accountRoles.constant';
import { ClassStudent } from './../../database/entities/classStudent.entity';
import { ClassTeacher } from './../../database/entities/classTeacher.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ClassService } from './class.service';
import { CheckAttendance, GetListMembersDto } from './dto/query-member.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { RemoveMembersDto } from './dto/remove-member.dto';
import { StudentAnswer } from '../../database/entities/student_answer.entity';
import { Quiz } from '../../database/entities/quiz.entity';
import * as dayjs from 'dayjs';
import { quizStatus } from '../../constants/quizStatus.constant';
import { AcceptStudentDto } from './dto/accept-student.dto';

@Injectable()
export class MemberService {
    constructor(
        private userService: UserService,
        private classService: ClassService,
        @InjectRepository(ClassTeacher)
        private classTeacherRepository: Repository<ClassTeacher>,
        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,
        @InjectRepository(StudentAnswer)
        private studentAnswersRepository: Repository<StudentAnswer>,
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
    ) {}

    async getMembers({ classId, search, take, skip }: GetListMembersDto) {
        const teachers = await this.classTeacherRepository.find({
            where: {
                classId,
            },
            relations: ['user'],
        });

        const query = this.classStudentRepository
            .createQueryBuilder('classStudent')
            .innerJoinAndSelect('classStudent.user', 'user')
            .where({ classId })
            .orderBy({
                'classStudent.id': 'DESC',
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere(
                'UPPER(user.email) LIKE UPPER(:search) OR UPPER(user.firstName) LIKE UPPER(:search) OR UPPER(user.lastName) LIKE UPPER(:search)',
                { search },
            );
        }
        const [records, total] = await query.getManyAndCount();

        return {
            teachers: { records: teachers },
            students: { take, skip, records, total },
        };
    }

    async addMemberToClass(teacherId: number, { classId, userId }: AddMemberDto) {
        await this.classService.getClassOfTeacherById(teacherId, classId);

        const user = await this.userService.getUserById(userId);
        if (user.role === roles.TEACHER.value) {
            if (await this.classTeacherRepository.findOneBy({ classId, userId: userId })) {
                throw new HttpException(errors.MEMBER_ALREADY_IN_CLASS, HttpStatus.BAD_REQUEST);
            }
            await this.classTeacherRepository.save({ classId, userId });
        } else if (user.role === roles.STUDENT.value) {
            if (await this.classStudentRepository.findOneBy({ classId, userId: userId })) {
                throw new HttpException(errors.MEMBER_ALREADY_IN_CLASS, HttpStatus.BAD_REQUEST);
            }
            await this.classStudentRepository.save({ classId, userId, waiting: false });
        }

        return { message: 'ok' };
    }

    async removeMembersFromClass(teacherId: number, { classId, ids }: RemoveMembersDto) {
        if (ids.includes(teacherId)) {
            throw new HttpException(errors.DELETE_SELF, HttpStatus.BAD_REQUEST);
        }
        await this.classService.getClassOfTeacherById(teacherId, classId);
        await this.classTeacherRepository.delete({ classId, userId: In(ids) });
        await this.classStudentRepository.delete({ classId, userId: In(ids) });
        return { message: 'ok' };
    }

    async checkAttendance({ classId, userId }: CheckAttendance) {
        const records = await this.quizRepository
            .createQueryBuilder('quiz')
            .where({ classId })
            .orderBy({
                id: 'DESC',
            })
            .getMany();

        const quizzes = records.filter(
            (q) => dayjs(q.closeTime).isBefore(dayjs()) || q.status === quizStatus.CLOSED.value,
        );

        const ids = quizzes.map((record) => record.id);

        const [answers, answerTotal] = await this.studentAnswersRepository
            .createQueryBuilder('studentAnswers')
            .innerJoinAndSelect('studentAnswers.classStudent', 'classStudent')
            .innerJoinAndSelect('classStudent.user', 'user', 'classStudent.userId=:userId', { userId })
            .where({
                quizId: In(ids),
            })
            .getManyAndCount();

        return {
            // quizzes,
            quizTotal: quizzes.length,
            // answers,
            answerTotal,
        };
    }

    async acceptStudent(userId: number, { classId, studentId }: AcceptStudentDto) {
        const student = await this.classStudentRepository
            .createQueryBuilder('classStudent')
            .innerJoinAndSelect('classStudent.class', 'class', 'class.id=:classId', { classId })
            .innerJoinAndSelect('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ userId: studentId })
            .getOne();

        if (!student) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        student.waiting = false;
        return this.classStudentRepository.save(student);
    }
}
