import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBorrowingBookRelation1755159124271 implements MigrationInterface {
    name = 'AddBorrowingBookRelation1755159124271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."book_borrower_status_enum" AS ENUM('BORROWED', 'RETURNED', 'OVERDUE')`);
        await queryRunner.query(`CREATE TABLE "book_borrower" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "bookId" integer NOT NULL, "borrowDate" TIMESTAMP NOT NULL DEFAULT now(), "dueDate" date NOT NULL, "returnDate" date, "status" "public"."book_borrower_status_enum" NOT NULL DEFAULT 'BORROWED', "remarks" character varying(250), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d17456cf8c572a8be0bcfaced1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book_borrower" ADD CONSTRAINT "FK_8a7d7f0b499e81ddb2bd06ffd82" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_borrower" ADD CONSTRAINT "FK_af5d8bc79a83bb596666ba12e06" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_borrower" DROP CONSTRAINT "FK_af5d8bc79a83bb596666ba12e06"`);
        await queryRunner.query(`ALTER TABLE "book_borrower" DROP CONSTRAINT "FK_8a7d7f0b499e81ddb2bd06ffd82"`);
        await queryRunner.query(`DROP TABLE "book_borrower"`);
        await queryRunner.query(`DROP TYPE "public"."book_borrower_status_enum"`);
    }

}
