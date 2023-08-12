import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ClassStudent } from './classStudent.entity';
import { ClassTeacher } from './classTeacher.entity';
import { Quiz } from './quiz.entity';

@Entity('classes')
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('varchar')
    public name: string;

    @Column('varchar')
    public description: string;

    @Column('int')
    classNumber: number;

    @Column('varchar')
    public joinCode: string;

    @Column('bool', {
        default: false,
    })
    public requirePermission: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => ClassStudent, (classStudent) => classStudent.class, {
        cascade: true,
    })
    public classStudents: ClassStudent[];

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.class, {
        cascade: true,
    })
    public classTeachers: ClassTeacher[];

    @OneToMany(() => Quiz, (quiz) => quiz.class, {
        cascade: true,
    })
    public quizzes: Quiz[];

    constructor(props: Partial<Class>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
