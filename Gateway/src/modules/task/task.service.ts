import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TASK_STAGE } from 'shared/interfaces/enums';
import { isNotExsistThrows } from '../../utils/isNotExsistThrows';
import { IPagination } from 'shared/interfaces/pagination.interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepository.create({
      stage: TASK_STAGE.TODO,
      taskText: createTaskDto.taskText,
      dueDate: createTaskDto.dueDate,
      assignDate: new Date(),
      employee: { employeeId: createTaskDto.employeeId },
    });

    await this.taskRepository.save(newTask);
    return newTask;
  }

  async findEmployeeTasks(employeeId: number, queryParams: IPagination) {
    const { limit, page } = queryParams;
    const [results, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        employee: { employeeId },
      },
    });

    return {
      data: results,
      total,
      page,
      limit,
    };
  }

  async findOneTask(taskId: number) {
    return isNotExsistThrows({
      value: await this.taskRepository.findOneBy({ taskId }),
      message: `Task ${taskId} does not exist`,
    });
  }

  // async managerUpdate(id: number, updateTaskDto: ManagerUpdateTaskDto) {
  //   await this.findOneTask(id);
  //   const { employeeId } = updateTaskDto;
  //   return await this.taskRepository.update(id, {
  //     ...updateTaskDto,
  //     employee: { employeeId },
  //   });
  // }
}
