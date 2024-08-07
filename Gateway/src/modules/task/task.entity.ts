import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { TASK_STAGE } from 'shared/interfaces/enums';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ name: 'task_id' })
  taskId: number;

  @ManyToOne(() => Employee, (employee) => employee.tasks)
  employee: Employee;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'assign_date',
    nullable: false,
  })
  assignDate: Date;

  @Column({ type: 'text', name: 'task_text', nullable: false })
  taskText: string;

  @Column({
    type: 'timestamptz',
    name: 'due_date',
    nullable: false,
  })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TASK_STAGE,
  })
  stage: TASK_STAGE;
}
