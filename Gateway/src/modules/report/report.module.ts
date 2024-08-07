import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { EmployeesRlationsModule } from '../employees-relations/employees-relations.module';
import { JwtService } from '../auth/jwt.service';
import { Report } from './report.entity';

@Module({
  imports: [
    forwardRef(() => EmployeesRlationsModule),
    TypeOrmModule.forFeature([Report]),
  ],
  controllers: [ReportController],
  providers: [ReportService, JwtService],
})
export class ReportModule {}
