import { Class } from './../database/entities/class.entity';

export interface ClassRequest extends Request {
    class: Class;
}
