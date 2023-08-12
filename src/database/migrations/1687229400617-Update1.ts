import { MigrationInterface, QueryRunner } from "typeorm";

export class Update11687229400617 implements MigrationInterface {
    name = 'Update11687229400617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` CHANGE \`name\` \`name\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` CHANGE \`name\` \`name\` varchar(255) NOT NULL
        `);
    }

}
