import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../shared/pagination-dto';
import { excludeColumns } from '../../utils/excludeColumns';
import { IEmployeeWithoutPassword } from 'shared/interfaces/employee.interface';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const newUser = await this.employeeService.create(createEmployeeDto);
    this.logger.log(`${newUser.email} ${createEmployeeDto.name} created`);
    return newUser;
  }

  @Get()
  async findWithPagination(@Query() queryParams: PaginationDto) {
    return await this.employeeService.findAllByPages(queryParams);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IEmployeeWithoutPassword> {
    this.logger.log(`Employee with id ${id} was serached`);
    const employeeWithoutPassword = excludeColumns(
      await this.employeeService.isEmployeeNotExsistThrows(id),
      ['hashedPassword'],
    );
    return employeeWithoutPassword;
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.employeeService.remove(+id);
  }
}
