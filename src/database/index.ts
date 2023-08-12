import { Class } from './entities/class.entity';
import { ClassStudent } from './entities/classStudent.entity';
import { ClassTeacher } from './entities/classTeacher.entity';
import { Key } from './entities/key.entity';
import { Quiz } from './entities/quiz.entity';
import { StudentAnswer } from './entities/student_answer.entity';
import { User } from './entities/user.entity';

export const entities = [User, Class, ClassStudent, ClassTeacher, Quiz, Key, StudentAnswer];
