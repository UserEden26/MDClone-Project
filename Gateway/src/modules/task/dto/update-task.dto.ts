import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { TASK_STAGE } from 'shared/interfaces/enums';
import { CreateTaskDto } from './create-task.dto';

export class EmployeeUpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(TASK_STAGE)
  stage: TASK_STAGE;
}

export class ManagerUpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(TASK_STAGE)
  stage?: TASK_STAGE;

  @ValidateIf((o) => Object.keys(o).length === 0)
  @IsNotEmpty({ message: 'At least one field must be provided for update' })
  _atLeastOneFieldShouldBePresent?: never;
}
