import { StudentAnswer } from './../../database/entities/student_answer.entity';
import { geolocationToDistance } from './../../utils/geolocation.util';
import { examineAnswers } from './../../utils/examineAnswers.util';
import { quizStatus } from './../../constants/quizStatus.constant';
import { IdsDto } from '../../utils/common-dto.util';
import { errors } from './../../constants/message.constant';
import { Quiz } from './../../database/entities/quiz.entity';
import { Key } from './../../database/entities/key.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassService } from '../class/class.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import * as dayjs from 'dayjs';
import { GetListQuizzesDto } from './dto/query-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { DoQuizDto } from './dto/do-quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        private classService: ClassService,
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
        @InjectRepository(Key)
        private keyRepository: Repository<Key>,
        @InjectRepository(StudentAnswer)
        private studentAnswerRepository: Repository<StudentAnswer>,
    ) {}

    async createQuiz(userId: number, body: CreateQuizDto) {
        const { name, classId, questions, closeTime, status, position, key } = body;

        await this.classService.getClassOfTeacherById(userId, classId);
        if (status === quizStatus.OPENED.value && !position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
        }

        const quiz = new Quiz({
            name,
            classId,
            position,
            closeTime,
            status,
            questions,
            key: new Key({
                keys: key,
            }),
        });
        console.log(quiz);

        if (closeTime && dayjs(closeTime).isBefore(dayjs())) {
            quiz.status = quizStatus.CLOSED.value;
        }

        return this.quizRepository.save(quiz);
    }

    async getListQuizzesOfClass(userId: number, { classId, take, skip }: GetListQuizzesDto) {
        await this.classService.getClassOfTeacherById(userId, classId);

        const [records, total] = await this.quizRepository
            .createQueryBuilder('quiz')
            .where({ classId })
            .orderBy({
                id: 'DESC',
            })
            .take(take)
            .skip(skip)
            .getManyAndCount();

        return { take, skip, records, total };
    }

    async getListQuizzesOfClassStudent(userId: number, { classId, search = '', take, skip }: GetListQuizzesDto) {
        const query = this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin(
                'class.classStudents',
                'classStudent',
                'classStudent.userId = :userId AND classStudent.waiting = 0',
                { userId },
            )
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer', 'studentAnswer.classStudentId = classStudent.id')
            .where({ classId })
            .orderBy({
                'quiz.id': 'DESC',
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere('UPPER(quiz.name) LIKE UPPER(:search)', { search });
        }

        const [records, total] = await query.getManyAndCount();
        return { take, skip, total, records };
    }

    async getQuizById(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .innerJoinAndSelect('quiz.key', 'key')
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer')
            .leftJoinAndSelect('studentAnswer.classStudent', 'classStudent')
            .leftJoinAndSelect('classStudent.user', 'user')
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async getQuizByIdStudent(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin(
                'class.classStudents',
                'classStudent',
                'classStudent.userId = :userId AND classStudent.waiting = 0',
                { userId },
            )
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer', 'studentAnswer.classStudentId = classStudent.id')
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async getQuizWithKeyById(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id })
            .innerJoinAndSelect('quiz.key', 'key')
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer')
            .leftJoinAndSelect('studentAnswer.classStudent', 'classStudent')
            .leftJoinAndSelect('classStudent.user', 'user')
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async updateQuiz(userId: number, id: number, body: UpdateQuizDto) {
        const { questions, closeTime, status, position, key } = body;

        const quiz = await this.getQuizById(userId, id);
        quiz.status = status;
        if (questions) {
            quiz.questions = questions;
            quiz.key.keys = key;
        }
        if (closeTime) {
            quiz.closeTime = closeTime;
            if (dayjs(closeTime).isBefore(dayjs())) {
                quiz.status = quizStatus.CLOSED.value;
            }
            if (status === 2 && dayjs(closeTime).isAfter(dayjs())) {
                quiz.status = quizStatus.OPENED.value;
            }
        }
        if (status === quizStatus.OPENED.value) {
            if (!position) {
                throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
            }
            quiz.status = status;
            quiz.position = position;
        }
        return this.quizRepository.save(quiz);
    }

    async deleteQuizzes(userId: number, { ids }: IdsDto) {
        const validQuizzes = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where('quiz.id IN(:ids)', { ids })
            .getMany();
        const quizIds = validQuizzes.map((e) => e.id);
        return this.quizRepository.delete(quizIds);
    }

    async getQuizWithKeyByIdStudent(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoinAndSelect('quiz.class', 'class')
            .innerJoinAndSelect(
                'class.classStudents',
                'classStudent',
                'classStudent.userId = :userId AND classStudent.waiting = 0',
                { userId },
            )
            .leftJoinAndSelect('quiz.key', 'key')
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async doQuiz(userId: number, quizId: number, { position, answers }: DoQuizDto) {
        const quiz = await this.getQuizWithKeyByIdStudent(userId, quizId);
        const classStudentId = quiz.class.classStudents[0].id;
        if (
            quiz.status === quizStatus.NOT_OPEN.value ||
            quiz.status === quizStatus.CLOSED.value ||
            dayjs(quiz.closeTime).isBefore(dayjs())
        ) {
            throw new HttpException(errors.CAN_NOT_ACCESS, HttpStatus.BAD_REQUEST);
        }
        if (!quiz.position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.CONFLICT);
        }
        if (geolocationToDistance(position, quiz.position) > 80) {
            throw new HttpException(errors.TOO_DISTANCED, HttpStatus.BAD_REQUEST);
        }
        const points = examineAnswers(answers, quiz.key.keys);
        if (points === -1) {
            throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
        }

        if (
            await this.studentAnswerRepository.findOneBy({
                classStudentId,
                quizId,
            })
        ) {
            throw new HttpException(errors.AVAILABLE_ANSWER, HttpStatus.BAD_REQUEST);
        }

        return this.studentAnswerRepository.save(
            new StudentAnswer({
                quizId,
                classStudentId: quiz.class.classStudents[0].id,
                position,
                answers,
                points: (points * 10) / quiz.questions.length,
                // total: quiz.questions.length,
            }),
        );
    }
}
