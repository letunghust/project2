import { Position } from './../../types/Position.type';
import { AnswerKey } from './../../types/AnswerKey.type';
import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { ClassStudent } from './classStudent.entity';
import { Quiz } from './quiz.entity';

@Entity('student_answer')
export class StudentAnswer extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    classStudentId: number;

    @Column('int')
    public quizId: number;

    @Column('json')
    position: Position;

    @Column('json')
    public answers: AnswerKey[];

    @Column('int')
    points: number;

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => ClassStudent, (classStudent) => classStudent.studentAnswers, {
        onDelete: 'CASCADE',
    })
    public classStudent: ClassStudent;

    @ManyToOne(() => Quiz, (quiz) => quiz.studentAnswers, {
        onDelete: 'CASCADE',
    })
    quiz: Quiz;

    constructor(props: Partial<StudentAnswer>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
