import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { errors } from 'src/constants/message.constant';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassTeacher } from 'src/database/entities/classTeacher.entity';
import { ClassStudent } from 'src/database/entities/classStudent.entity';
import { IdsDto, QueryDto } from 'src/utils/common-dto.util';
import { Class } from 'src/database/entities/class.entity';
import { User } from 'src/database/entities/user.entity';
import { ClassStudentDto } from './dto/class-student.dto';
import { RemoveMembersDto } from './dto/remove-member.dto';
import { JoinClassDto } from './dto/join-class.dto';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(ClassTeacher)
        private classTeacherRepository: Repository<ClassTeacher>,
        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,
    ) {}

    async getListClassesOfTeacher(userId: number, { search, take, skip }: QueryDto) {
        const query = this.classTeacherRepository
            .createQueryBuilder('teacherClass')
            .innerJoinAndSelect('teacherClass.class', 'class')
            .where({
                userId,
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere('(UPPER(class.name) LIKE UPPER(:search) OR class.classNumber LIKE :search)', { search });
        }
        const [records, total] = await query.getManyAndCount();

        return { take, skip, total, records };
    }

    async getClassOfTeacherById(userId: number, classId: number) {
        const _class = await this.classRepository
            .createQueryBuilder('class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id: classId })
            .getOne();
        if (!_class) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return _class;
    }

    async getListClassesByStudent(userId: number, { search = '', take, skip }: QueryDto) {
        const query = this.classStudentRepository
            .createQueryBuilder('studentClass')
            .innerJoinAndSelect('studentClass.class', 'class')
            .where({
                userId,
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere('(UPPER(class.name) LIKE UPPER(:search) OR class.classNumber LIKE :search)', { search });
        }
        const [records, total] = await query.getManyAndCount();

        return { take, skip, total, records };
    }

    async getClassOfStudentById(userId: number, classId: number) {
        const _class = await this.classRepository
            .createQueryBuilder('class')
            .innerJoin('class.classStudents', 'classStudent', 'classStudent.userId = :userId', { userId })
            .where({ id: classId })
            .getOne();
        if (!_class) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return _class;
    }

    async createClass(userId: number, body: CreateClassDto) {
        if (await this.classRepository.findOneBy({ classNumber: body.classNumber })) {
            throw new HttpException(errors.CLASS_NUMBER_TAKEN, HttpStatus.BAD_REQUEST);
        }

        const _class = new Class(body);

        const record = await this.classRepository.save(_class);

        const classTeacher = new ClassTeacher({
            classId: record.id,
            userId: userId,
        });

        await this.classTeacherRepository.save(classTeacher);

        return { userId, _class };
    }

    async updateClass(userId: number, classId: number, body: UpdateClassDto) {
        const _class = await this.getClassOfTeacherById(userId, classId);

        if (
            body.classNumber !== undefined &&
            (await this.classRepository.findOneBy({ classNumber: body.classNumber, id: Not(classId) }))
        ) {
            throw new HttpException(errors.CLASS_NUMBER_TAKEN, HttpStatus.BAD_REQUEST);
        }

        Object.assign(_class, body);

        return this.classRepository.save(_class);
    }

    async deleteClasses(userId: number, { ids }: IdsDto) {
        const teacherClasses = await this.classTeacherRepository.findBy({
            classId: In(ids),
            userId: userId,
        });
        const classIds = teacherClasses.map((e) => e.classId);
        return this.classRepository.delete(classIds);
    }

    async addMemberToClass(body: ClassStudentDto) {
        const existingStudent = await this.classStudentRepository.findOne({
            where: { userId: body.studentId },
            withDeleted: true,
        });

        if (!existingStudent) {
            const student = new ClassStudent(body);
            await this.classStudentRepository.save(student);
        } else {
            throw new HttpException(errors.EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
        }
    }

    async removeMemberFromClass(teacherId: number, { classId, ids }: RemoveMembersDto) {
        if (ids.includes(teacherId)) {
            throw new HttpException(errors.CAN_NOT_REMOVE, HttpStatus.BAD_REQUEST);
        }
        await this.getClassOfTeacherById(teacherId, classId);
        await this.classTeacherRepository.delete({ classId, userId: In(ids) });
        await this.classStudentRepository.delete({ classId, userId: In(ids) });
        return { message: 'OK' };
    }

    async leaveClass(userId: number, classId: number) {
        const member = await this.classStudentRepository.findBy({
            userId,
            classId,
        });
        const memberId = member.map((member) => member.userId);
        return this.classStudentRepository.delete(memberId);
    }

    async joinClass(userId: number, { classNumber }: JoinClassDto) {
        const _class = await this.classRepository.findOneBy({ classNumber });

        if (!_class) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        if (await this.classStudentRepository.findOneBy({ userId, classId: _class.id })) {
            throw new HttpException(errors.ALREADY_IN_CLASS, HttpStatus.BAD_REQUEST);
        }

        return this.classStudentRepository.save(
            new ClassStudent({
                userId,
                waiting: _class.requirePermission,
                class: _class,
            }),
        );
    }
}
