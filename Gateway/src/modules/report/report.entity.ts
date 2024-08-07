import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ManagerEmployee } from '../employees-relations/employees-relations.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn({ name: 'report_id' })
  reportId: number;

  @ManyToOne(
    () => ManagerEmployee,
    (managerEmployee) => managerEmployee.reports,
  )
  relation: ManagerEmployee;

  @Column({
    type: 'timestamptz',
    name: 'report_date',
    nullable: false,
  })
  reportDate: Date;

  @Column({ type: 'text', name: 'report_text', nullable: false })
  reportText: string;
}
