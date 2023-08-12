import { join } from 'path';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { config } from 'dotenv';

config();

export const options: MysqlConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '/entities/*{.ts,.js}')],
    migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
    logging: process.env.MODE === 'development',
};

const AppDataSource = new DataSource(options);
AppDataSource.initialize();

export default AppDataSource;
