import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1755087493503 implements MigrationInterface {
    name = 'SecondMigration1755087493503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "ISBN" character varying(20) NOT NULL, "availableQuantity" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7459018069b9c93b1d66ec013a4" UNIQUE ("ISBN"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
