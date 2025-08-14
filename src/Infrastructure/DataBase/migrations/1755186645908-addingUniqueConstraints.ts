import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingUniqueConstraints1755186645908 implements MigrationInterface {
    name = 'AddingUniqueConstraints1755186645908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author" ADD CONSTRAINT "UQ_d3962fd11a54d87f927e84d1080" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5"`);
        await queryRunner.query(`ALTER TABLE "author" DROP CONSTRAINT "UQ_d3962fd11a54d87f927e84d1080"`);
    }

}
