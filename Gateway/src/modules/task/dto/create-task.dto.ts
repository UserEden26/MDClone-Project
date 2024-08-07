import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsTimestampWithTZ } from '../../../common/decorators/isDateWithTZ.decorator';
import { ICreateTask } from 'shared/interfaces/task.interface';

export class CreateTaskDto implements ICreateTask {
  @IsNotEmpty()
  @IsInt()
  employeeId: number;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  taskText: string;

  @IsNotEmpty()
  @IsTimestampWithTZ()
  dueDate: string;

  @IsTimestampWithTZ()
  assignDate: string;
}
