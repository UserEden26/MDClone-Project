import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeesRelationsService } from './employees-relations.service';
import { CreateEmployeesRelationDto } from './dto/create-employees-relation.dto';
import {
  IEmployeeExternal,
  IEmployeeWithoutPassword,
} from 'shared/interfaces/employee.interface';
import { NoAdminGuard } from '../../common/guards/no-admin.guard';
import { Request } from 'express';
import { PaginationDto } from '../../shared/pagination-dto';

@Controller('employees-relations')
export class EmployeesRelationsController {
  constructor(
    private readonly employeesRelationsService: EmployeesRelationsService,
  ) {}

  private isManagerForHimself = (managerId: number, employeeIds: number[]) => {
    if (employeeIds.includes(managerId)) {
      throw new BadRequestException("Manger can't manage himself");
    }
  };

  @Post()
  async crateRelation(@Body() createRelationDto: CreateEmployeesRelationDto) {
    this.isManagerForHimself(
      createRelationDto.managerId,
      createRelationDto.employeeIds,
    );
    return await this.employeesRelationsService.createRelations(
      createRelationDto,
    );
  }

  @Delete(':id')
  async deleteByManagerId(@Param('id', ParseIntPipe) id: number) {
    const removedelations =
      await this.employeesRelationsService.deleteAllManagerRelations(id);
    return removedelations;
  }

  @Get()
  @UseGuards(NoAdminGuard)
  async getMyEmployees(
    @Req() request: Request,
    @Query() paginationQuery: PaginationDto,
  ) {
    const managerEmployees =
      await this.employeesRelationsService.getManagerEmployeesPagenation(
        request.userId as number,
        paginationQuery,
      );
    return managerEmployees;
  }

  @Get(':id')
  async getRelations(
    @Param('id', ParseIntPipe) employeeId: number,
  ): Promise<IEmployeeExternal & IEmployeeWithoutPassword> {
    return await this.employeesRelationsService.getManagerAndEmployees(
      employeeId,
    );
  }

  @Get('/me')
  @UseGuards(NoAdminGuard)
  async getMe(@Req() request: Request) {
    return await this.employeesRelationsService.getManagerAndEmployees(
      request.userId as number,
    );
  }
}
