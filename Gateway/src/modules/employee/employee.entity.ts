import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  Index,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { ManagerEmployee } from '../employees-relations/employees-relations.entity';

@Entity('employees')
@Unique(['email'])
@Index('IDX_EMAIL', ['email'])
export class Employee {
  @PrimaryGeneratedColumn({ name: 'employee_id' })
  employeeId: number;

  @Column({ length: 50, name: 'employee_last_name', nullable: false })
  employeeLastName: string;

  @Column({ length: 50, name: 'employee_name', nullable: false })
  employeeName: string;

  @Column({ length: 255, nullable: false })
  position: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ type: 'text', name: 'hashed_password', nullable: false })
  hashedPassword: string;

  @OneToMany(() => Task, (task) => task.employee)
  tasks: Task[];

  @OneToMany(
    () => ManagerEmployee,
    (managerEmployee) => managerEmployee.manager,
  )
  managedEmployees: ManagerEmployee[];

  @OneToMany(
    () => ManagerEmployee,
    (managerEmployee) => managerEmployee.employee,
  )
  managers: ManagerEmployee[];
}
