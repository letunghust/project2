import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev51687242632961 implements MigrationInterface {
    name = 'Updatev51687242632961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
