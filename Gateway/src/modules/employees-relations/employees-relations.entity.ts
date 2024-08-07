import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { Report } from '../report/report.entity';

@Entity('Manager_Employee')
@Unique(['employee'])
export class ManagerEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.managedEmployees)
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @ManyToOne(() => Employee, (employee) => employee.managers)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => Report, (report) => report.relation)
  reports: Report[];
}
