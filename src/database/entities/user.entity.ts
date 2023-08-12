import { Exclude, instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { ClassStudent } from './classStudent.entity';
import { ClassTeacher } from './classTeacher.entity';
import { accountStatus } from '../../constants/accountStatus.constant';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('varchar', {
        unique: true,
    })
    public email: string;

    @Column('varchar')
    @Exclude()
    public password: string;

    @Column('varchar')
    public firstName: string;

    @Column('varchar')
    public lastName: string;

    @Column('tinyint')
    public role: number;

    @Column('varchar', {
        nullable: true,
    })
    public number: string;

    @Column('int', {
        default: accountStatus.ACTIVE.value,
    })
    public status: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => ClassStudent, (classStudent) => classStudent.user, {
        cascade: true,
    })
    public classStudents: ClassStudent[];

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.user, {
        cascade: true,
    })
    public classTeachers: ClassTeacher[];

    constructor(props: Partial<User>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
