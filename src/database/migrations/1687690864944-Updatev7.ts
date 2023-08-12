import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatev71687690864944 implements MigrationInterface {
    name = 'Updatev71687690864944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`class_student\` CHANGE \`waiting\` \`waiting\` tinyint NOT NULL DEFAULT 1
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`class_student\` CHANGE \`waiting\` \`waiting\` tinyint NOT NULL DEFAULT '0'
        `);
    }

}
