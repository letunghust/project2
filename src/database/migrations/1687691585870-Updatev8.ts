import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev81687691585870 implements MigrationInterface {
    name = 'Updatev81687691585870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_e0fed76cb073101640a4a522c4c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_e0fed76cb073101640a4a522c4c\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_student\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answer\` DROP FOREIGN KEY \`FK_e0fed76cb073101640a4a522c4c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answer\`
            ADD CONSTRAINT \`FK_e0fed76cb073101640a4a522c4c\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
