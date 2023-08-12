import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/database/entities/user.entity';
import { errors } from 'src/constants/message.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/utils/common-dto.util';
import { roles } from 'src/constants/accountRoles.constant';

@Injectable()
export class UserService {
    constructor(
        private authService: AuthService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getUserById(userId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async createUser(body: CreateUserDto) {
        console.log(body);

        if (body.role === roles.STUDENT.value && !body.number) {
            throw new HttpException(errors.STUDENT_NUMBER_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this.userRepository.findOne({
            where: { email: body.email },
            withDeleted: true,
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                await this.userRepository.remove(existingUser);
            }
            throw new HttpException(errors.EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
        }

        const user = new User(body);

        await this.authService.hashPassword(user);

        return await this.userRepository.save(user);

        // return 'success';

        // return this.authService.login(body.email, body.password);
    }

    async updateUser(user: User, body: UpdateUserDto) {
        Object.assign(user, body);

        if (user.role === roles.STUDENT.value && !user.number) {
            throw new HttpException(errors.STUDENT_NUMBER_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        return this.userRepository.save(user);
    }

    async deleteUser(user: User) {
        return this.userRepository.softRemove(user);
    }

    async getListUsers({ search = '', take = 10, skip = 0 }: QueryDto) {
        search = '%' + search.replace(/\s+/g, '%') + '%';
        const [records, total] = await this.userRepository.findAndCount({
            where: [{ email: ILike(search) }, { firstName: ILike(search) }, { lastName: ILike(search) }],
            take,
            skip,
        });
        return { take, skip, total, records };
    }

    async getListStudentOfClass(classId: number, { search = '', take, skip }: QueryDto) {
        const query = this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.classStudents', 'classStudent', 'classStudent.classId = :classId', { classId })
            .take(take)
            .skip(skip);

        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.where('(user.email LIKE (:search))', { search });
        }

        const [records, total] = await query.getManyAndCount();

        return { take, skip, total, records };
    }

    async getListStudents({ search = '', take, skip }: QueryDto) {
        const query = await this.userRepository
            .createQueryBuilder('user')
            .where('user.role = :role', { role: 1 })
            .take(take)
            .skip(skip);

        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere('(user.email ILIKE (:search))', { search });
        }

        const records = await query.getMany();

        return { take, skip, records };
    }
}
