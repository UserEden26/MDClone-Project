import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Inject,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { NoAdminGuard } from '../../common/guards/no-admin.guard';
import { HasEmployeesGuard } from '../../common/guards/has-employees.guard';
import { Request } from 'express';
import { EmployeesRelationsService } from '../employees-relations/employees-relations.service';
import { PaginationDto } from '../../shared/pagination-dto';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject()
    private readonly employeesRelationsService: EmployeesRelationsService,
  ) {}

  @Post()
  @UseGuards(NoAdminGuard, HasEmployeesGuard)
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    const relation = await this.employeesRelationsService.getRlation(
      request.userId as number,
      createTaskDto.employeeId,
    );
    if (!relation) {
      throw new BadRequestException(
        `You are not manager of ${createTaskDto.employeeId}`,
      );
    }
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @UseGuards(NoAdminGuard)
  async findTasksWithQuery(@Query() paginationQuery: PaginationDto) {
    return await this.taskService.findEmployeeTasks(
      paginationQuery.forEmp as number,
      paginationQuery,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOneTask(id);
  }
}
