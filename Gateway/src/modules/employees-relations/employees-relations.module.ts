import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEmployee } from './employees-relations.entity';
import { EmployeesRelationsService } from './employees-relations.service';
import { EmployeesRelationsController } from './employees-relations.controller';
import { EmployeeModule } from '../employee/employee.module';
import { ReportModule } from '../report/report.module';
import { CustomCacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManagerEmployee]),
    forwardRef(() => EmployeeModule),
    CustomCacheModule,
    ReportModule,
  ],
  providers: [EmployeesRelationsService],
  controllers: [EmployeesRelationsController],
  exports: [EmployeesRelationsService],
})
export class EmployeesRlationsModule {}
