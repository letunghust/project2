import { instanceToInstance } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { StudentAnswer } from './student_answer.entity';

@Entity('class_student')
export class ClassStudent extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    public classId: number;

    @Column('int')
    public userId: number;

    @Column('bool', {
        default: false,
    })
    hidden: boolean;

    @Column('bool', {
        default: true,
    })
    waiting: boolean;

    @ManyToOne(() => Class, (_class) => _class.classStudents, {
        onDelete: 'CASCADE',
    })
    public class: Class;

    @ManyToOne(() => User, (student) => student.classStudents, {
        onDelete: 'CASCADE',
    })
    public user: User;

    @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.classStudent, {
        cascade: true,
    })
    public studentAnswers: StudentAnswer[];

    constructor(props: Partial<ClassStudent>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
