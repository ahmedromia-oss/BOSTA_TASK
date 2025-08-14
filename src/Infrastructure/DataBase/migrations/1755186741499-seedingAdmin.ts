import { MigrationInterface, QueryRunner } from "typeorm";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UserType } from "../../../Domain/constants.js";

export class SeedingAdmin1755185756193 implements MigrationInterface {
    name = "1755186741499"
    
    private async hashSaltPassword(password: string): Promise<string> {
        const scrypt = promisify(_scrypt);
        const salt = randomBytes(8).toString("hex");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + "." + hash.toString("hex");
        return result;
    }
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await this.hashSaltPassword("admin123");

        await queryRunner.query(
            `
            INSERT INTO "user" (username, email, password, "userType")
            VALUES ($1, $2, $3, $4);
            `,
            ["SuperAdmin", "admin@gmail.com", hashedPassword, UserType.ADMIN]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "user" WHERE email = $1;`,
            ["admin@gmail.com"]
        );
    }
}