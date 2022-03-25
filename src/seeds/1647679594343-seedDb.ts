import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedDb1647679594343 implements MigrationInterface {
    name = 'SeedDb1647679594343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`);
        // pass 1234
        await queryRunner.query(`INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$ccKCX5jrnRJQW6M8qxnITOJGLfSnSEmRv.IM2LsF0SovEOPKmK9aa')`);

        await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'first article desc', 'first articl body', 'coffee,dragons', 1)`);

        await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second article', 'second article desc', 'second articl body', 'coffee,dragons', 1)`);

    }

    

    public async down(): Promise<void> {
    }

}
