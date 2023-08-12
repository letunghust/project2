import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentAnswerTab1687163599304 implements MigrationInterface {
    name = 'UpdateStudentAnswerTab1687163599304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP COLUMN \`studentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP COLUMN \`position\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD \`position\` json NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` CHANGE \`answers\` \`answers\` json NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` CHANGE \`answers\` \`answers\` json NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP COLUMN \`position\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD \`position\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD \`studentId\` int NOT NULL
        `);
    }

}
