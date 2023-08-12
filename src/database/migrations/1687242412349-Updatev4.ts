import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev41687242412349 implements MigrationInterface {
    name = 'Updatev41687242412349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_60e3a3f0875fdf970ffb5e5f65e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_60e3a3f0875fdf970ffb5e5f65e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_60e3a3f0875fdf970ffb5e5f65e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_60e3a3f0875fdf970ffb5e5f65e\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
