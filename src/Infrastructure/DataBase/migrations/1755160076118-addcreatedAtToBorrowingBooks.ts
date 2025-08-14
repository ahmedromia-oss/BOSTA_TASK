import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcreatedAtToBorrowingBooks1755160076118 implements MigrationInterface {
    name = 'AddcreatedAtToBorrowingBooks1755160076118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_borrower" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_borrower" DROP COLUMN "createdAt"`);
    }

}
