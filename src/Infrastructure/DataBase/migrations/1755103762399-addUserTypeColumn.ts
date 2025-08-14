import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTypeColumn1755103762399 implements MigrationInterface {
    name = 'AddUserTypeColumn1755103762399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "authorId" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "authorId"`);
    }

}
