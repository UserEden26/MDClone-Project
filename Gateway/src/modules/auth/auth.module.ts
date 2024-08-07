import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [EmployeeModule],
  providers: [JwtService],
  exports: [JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
