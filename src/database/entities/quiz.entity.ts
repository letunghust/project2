import { Question } from './../../types/Question.type';
import { Position } from './../../types/Position.type';
import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    DeleteDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { quizStatus } from '../../constants/quizStatus.constant';
import { Key } from './key.entity';
import { StudentAnswer } from './student_answer.entity';

@Entity('quizzes')
export class Quiz extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('varchar', {
        nullable: true,
    })
    name: string;

    @Column('int')
    public classId: number;

    @Column('json', {
        nullable: true,
    })
    public position: Position;

    @Column('timestamp', { nullable: true })
    public closeTime: Date | null;

    @Column('int', {
        default: quizStatus.NOT_OPEN.value,
    })
    public status: number;

    @Column('json')
    questions: Question[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Class, (_class) => _class.quizzes, {
        onDelete: 'CASCADE',
    })
    public class: Class;

    @OneToOne(() => Key, (key) => key.quiz, {
        cascade: true,
    })
    public key: Key;

    @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.quiz, {
        cascade: true,
    })
    studentAnswers: StudentAnswer[];

    constructor(props: Partial<Quiz>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
