import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { EmployeesRlationsModule } from '../employees-relations/employees-relations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => EmployeesRlationsModule),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
