import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev61687685468192 implements MigrationInterface {
    name = 'Updatev61687685468192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD \`deleteAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\`
            ADD \`deleteAt\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` DROP COLUMN \`deleteAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP COLUMN \`deleteAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP COLUMN \`createAt\`
        `);
    }

}
