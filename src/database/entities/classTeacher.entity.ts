import { instanceToInstance } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

@Entity('class_teacher')
export class ClassTeacher extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('int')
    classId: number;

    @Column('int')
    userId: number;

    @Column('bool', {
        default: false,
    })
    hidden: boolean;

    @ManyToOne(() => Class, (_class) => _class.classTeachers, {
        onDelete: 'CASCADE',
    })
    public class: Class;

    @ManyToOne(() => User, (teacher) => teacher.classTeachers, {
        onDelete: 'CASCADE',
    })
    public user: User;

    constructor(props: Partial<ClassTeacher>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
