import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1723001133696 implements MigrationInterface {
    name = 'Initial1723001133696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_stage_enum" AS ENUM('TODO', 'IN PROGRESS', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "task" ("task_id" SERIAL NOT NULL, "assign_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "task_text" text NOT NULL, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "stage" "public"."task_stage_enum" NOT NULL, "employeeEmployeeId" integer, CONSTRAINT "PK_721f914bb100703f201a77dd58f" PRIMARY KEY ("task_id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("employee_id" SERIAL NOT NULL, "employee_last_name" character varying(50) NOT NULL, "employee_name" character varying(50) NOT NULL, "position" character varying(255) NOT NULL, "email" character varying(50) NOT NULL, "hashed_password" text NOT NULL, CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "PK_c9a09b8e6588fb4d3c9051c8937" PRIMARY KEY ("employee_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_EMAIL" ON "employees" ("email") `);
        await queryRunner.query(`CREATE TABLE "Manager_Employee" ("id" SERIAL NOT NULL, "manager_id" integer, "employee_id" integer, CONSTRAINT "UQ_57427dac7a7b4b281df95befd54" UNIQUE ("employee_id"), CONSTRAINT "PK_8ef75f42871e3ae2499d5fdb15b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("report_id" SERIAL NOT NULL, "report_date" TIMESTAMP WITH TIME ZONE NOT NULL, "report_text" text NOT NULL, "relationId" integer, CONSTRAINT "PK_1bdd9ab86f1a920d365961cb28c" PRIMARY KEY ("report_id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_81f3b94506b38c8c3d3d2536bf3" FOREIGN KEY ("employeeEmployeeId") REFERENCES "employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Manager_Employee" ADD CONSTRAINT "FK_c04c5954ad89fd9bca246e53279" FOREIGN KEY ("manager_id") REFERENCES "employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Manager_Employee" ADD CONSTRAINT "FK_57427dac7a7b4b281df95befd54" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_bdbf82956670d32f9c60199ab6c" FOREIGN KEY ("relationId") REFERENCES "Manager_Employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_bdbf82956670d32f9c60199ab6c"`);
        await queryRunner.query(`ALTER TABLE "Manager_Employee" DROP CONSTRAINT "FK_57427dac7a7b4b281df95befd54"`);
        await queryRunner.query(`ALTER TABLE "Manager_Employee" DROP CONSTRAINT "FK_c04c5954ad89fd9bca246e53279"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_81f3b94506b38c8c3d3d2536bf3"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "Manager_Employee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMAIL"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_stage_enum"`);
    }

}
