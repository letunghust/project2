import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1687148575205 implements MigrationInterface {
    name = 'Initial1687148575205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`class_teacher\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`userId\` int NOT NULL,
                \`hidden\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`role\` tinyint NOT NULL,
                \`number\` varchar(255) NULL,
                \`status\` int NOT NULL DEFAULT '1',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`keys\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quizId\` int NOT NULL,
                \`keys\` json NOT NULL,
                UNIQUE INDEX \`REL_e5be9d333384a94a1f3930093b\` (\`quizId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`quizzes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`position\` json NULL,
                \`closeTime\` timestamp NULL,
                \`status\` tinyint NOT NULL DEFAULT '0',
                \`questions\` json NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`student_answer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classStudentId\` int NOT NULL,
                \`studentId\` int NOT NULL,
                \`quizId\` int NOT NULL,
                \`position\` int NOT NULL,
                \`answers\` json NULL,
                \`points\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`class_student\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`userId\` int NOT NULL,
                \`hidden\` tinyint NOT NULL DEFAULT 0,
                \`waiting\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`classes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`classNumber\` int NOT NULL,
                \`joinCode\` varchar(255) NOT NULL,
                \`requirePermission\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleteAt\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teacher\`
            ADD CONSTRAINT \`FK_1b4adc80d48f7c04ed8e5f12baa\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teacher\`
            ADD CONSTRAINT \`FK_d21d093a1e0d6d7b3676d89f5d0\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\`
            ADD CONSTRAINT \`FK_ad50f2ee4661df22461a8f2594e\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_e0fed76cb073101640a4a522c4c\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_60e3a3f0875fdf970ffb5e5f65e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_student\`
            ADD CONSTRAINT \`FK_cb51ecfbd132b9e67e8a228b22b\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_student\`
            ADD CONSTRAINT \`FK_93059b475f907250b7df4d284ee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`class_student\` DROP FOREIGN KEY \`FK_93059b475f907250b7df4d284ee\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_student\` DROP FOREIGN KEY \`FK_cb51ecfbd132b9e67e8a228b22b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_60e3a3f0875fdf970ffb5e5f65e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_e0fed76cb073101640a4a522c4c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_ad50f2ee4661df22461a8f2594e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teacher\` DROP FOREIGN KEY \`FK_d21d093a1e0d6d7b3676d89f5d0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teacher\` DROP FOREIGN KEY \`FK_1b4adc80d48f7c04ed8e5f12baa\`
        `);
        await queryRunner.query(`
            DROP TABLE \`classes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`class_student\`
        `);
        await queryRunner.query(`
            DROP TABLE \`student_answer\`
        `);
        await queryRunner.query(`
            DROP TABLE \`quizzes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_e5be9d333384a94a1f3930093b\` ON \`keys\`
        `);
        await queryRunner.query(`
            DROP TABLE \`keys\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`class_teacher\`
        `);
    }

}
