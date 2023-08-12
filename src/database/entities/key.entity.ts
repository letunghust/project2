import { instanceToInstance } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity';
import { AnswerKey } from 'src/types/AnswerKey.type';

@Entity('keys')
export class Key extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    public quizId: number;

    @Column('json')
    keys: AnswerKey[];

    @OneToOne(() => Quiz, (quiz) => quiz.key, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'quizId',
    })
    public quiz: Quiz;

    constructor(props: Partial<Key>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
