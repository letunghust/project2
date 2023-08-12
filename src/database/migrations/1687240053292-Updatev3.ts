import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev31687240053292 implements MigrationInterface {
    name = 'Updatev31687240053292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\`
            ADD \`status\` int NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` DROP COLUMN \`status\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\`
            ADD \`status\` tinyint NOT NULL DEFAULT '0'
        `);
    }

}
