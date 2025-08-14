import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingIndexingForSearchOptimization1755204070113 implements MigrationInterface {
    name = 'AddingIndexingForSearchOptimization1755204070113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_author_name_created" ON "author" ("name", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_book_created_desc" ON "book" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_book_author_fk" ON "book" ("authorId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_book_isbn_unique" ON "book" ("ISBN") `);
        await queryRunner.query(`CREATE INDEX "idx_book_title_created" ON "book" ("title", "createdAt") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_user_email_unique" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_borrow_created_desc" ON "book_borrower" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_borrow_book_created_latest" ON "book_borrower" ("bookId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_borrow_user_status_created" ON "book_borrower" ("userId", "status", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_borrow_user_status_created"`);
        await queryRunner.query(`DROP INDEX "public"."idx_borrow_book_created_latest"`);
        await queryRunner.query(`DROP INDEX "public"."idx_borrow_created_desc"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email_unique"`);
        await queryRunner.query(`DROP INDEX "public"."idx_book_title_created"`);
        await queryRunner.query(`DROP INDEX "public"."idx_book_isbn_unique"`);
        await queryRunner.query(`DROP INDEX "public"."idx_book_author_fk"`);
        await queryRunner.query(`DROP INDEX "public"."idx_book_created_desc"`);
        await queryRunner.query(`DROP INDEX "public"."idx_author_name_created"`);
    }

}
