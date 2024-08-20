import { Exclude, Expose } from 'class-transformer';
import { IEmployeeWithoutPassword } from 'shared/interfaces/employee.interface';

export class NoPasswordEmployeeDto implements IEmployeeWithoutPassword {
  @Expose()
  email: string;

  @Expose()
  employeeId: number;

  @Expose()
  employeeLastName: string;

  @Expose()
  employeeName: string;

  @Expose()
  position: string;

  @Exclude()
  hashedPassword: string;
}
