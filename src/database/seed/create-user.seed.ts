import { JwtService } from '@nestjs/jwt';
import { Connection } from 'typeorm';
import { Seeder } from 'typeorm-seeding';
import { Factory } from 'typeorm-seeding/dist/types';
import { roles } from '../../constants/accountRoles.constant';
import { accountStatus } from '../../constants/accountStatus.constant';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection) {
        const userRepository = connection.getRepository(User);
        const authService = new AuthService(new JwtService(), userRepository);

        const existingAdmin = await userRepository.findOne({
            where: {
                email: process.env.DEFAULT_ADMIN_EMAIL,
            },
        });
        if (existingAdmin) return;

        const admin = new User({
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: process.env.DEFAULT_ADMIN_PASSWORD,
            status: accountStatus.ACTIVE.value,
            role: roles.ADMIN.value,
        });

        await authService.hashPassword(admin);

        await userRepository.save(admin);
    }
}
