import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsesernameToUsers1648031090362 implements MigrationInterface {
    name = 'AddUsesernameToUsers1648031090362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
