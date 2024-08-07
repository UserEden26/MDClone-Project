import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ValidateIf((o) => Object.keys(o).length === 0)
  @IsNotEmpty({ message: 'At least one field must be provided for update' })
  _atLeastOneFieldShouldBePresent?: never;
}
