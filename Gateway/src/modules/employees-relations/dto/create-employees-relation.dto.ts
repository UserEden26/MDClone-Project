import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateEmployeesRelationDto {
  @IsNotEmpty()
  @IsInt()
  managerId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsInt({ each: true })
  employeeIds: number[];
}
