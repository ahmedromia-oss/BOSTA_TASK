import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingAvailableQuantityConstraint1755197716724 implements MigrationInterface {
    name = 'AddingAvailableQuantityConstraint1755197716724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "CHK_9557b2dd444243824000a003f2" CHECK ("availableQuantity" >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "CHK_9557b2dd444243824000a003f2"`);
    }

}
