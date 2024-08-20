import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { isNotExsistThrows } from '../../utils/isNotExsistThrows';
import { hashPassword } from '../../utils/encrypt';
import { excludeColumns } from '../../utils/excludeColumns';
import { IReturnPagination } from 'shared/interfaces/pagination.interface';
import {
  IEmployeeExternal,
  IEmployeeWithoutPassword,
} from 'shared/interfaces/employee.interface';
import { plainToInstance } from 'class-transformer';
import { NoPasswordEmployeeDto } from '../../shared/no-password-employee.dto';
import { PaginationDto } from '../../shared/pagination-dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject() private cacheService: CacheService,
  ) {}

  async isEmployeeNotExsistThrows(id: number) {
    return isNotExsistThrows({
      value: await this.findOne(id),
    });
  }

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Exclude<Employee, 'hashedPassword'>> {
    const { lastName, name, position, password, email } = createEmployeeDto;
    const newEmployee = this.employeeRepository.create({
      employeeLastName: lastName,
      employeeName: name,
      position,
      email,
      hashedPassword: await hashPassword(password),
    });
    const employeeWithoutPassword = excludeColumns(
      await this.employeeRepository.save(newEmployee),
      ['hashedPassword'],
    );
    return employeeWithoutPassword;
  }

  async findAllByPages(
    queryParams: PaginationDto,
  ): Promise<IReturnPagination<IEmployeeWithoutPassword>> {
    const { limit, page } = queryParams;
    const [results, total] = await this.employeeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const finalResults = plainToInstance(NoPasswordEmployeeDto, results, {
      excludeExtraneousValues: true,
    });

    return {
      data: finalResults,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOneBy({
      employeeId: id,
    });

    return employee;
  }

  async findOneByEmail(email: string): Promise<Employee | null> {
    const cahceUser = await this.cacheService.get<Employee>(email);
    if (cahceUser) {
      return cahceUser;
    }
    const dbEmployee = await this.employeeRepository.findOneBy({
      email,
    });

    await this.cacheService.set(email, dbEmployee);
    return dbEmployee;
  }

  async findEmployeeRelations(employeeId: number) {
    const cahceEmployee = await this.cacheService.getEmployee(employeeId);

    if (cahceEmployee) {
      return cahceEmployee;
    }

    const employee = await this.employeeRepository.findOne({
      where: { employeeId: employeeId },
      relations: [
        'managedEmployees',
        'managedEmployees.employee',
        'managers',
        'managers.manager',
      ],
    });

    if (!employee) {
      return null;
    }

    const employeeStatic = plainToInstance(NoPasswordEmployeeDto, employee, {
      excludeExtraneousValues: true,
    });

    let manager: IEmployeeWithoutPassword | null = null;
    let managedEmployees: IEmployeeWithoutPassword[] | [] = [];
    // Transform the manager if it exists
    if (employee.managers && employee.managers.length > 0) {
      manager = plainToInstance(
        NoPasswordEmployeeDto,
        employee.managers[0].manager,
        {
          excludeExtraneousValues: true,
        },
      );
    }

    // Transform each managed employee
    if (employee.managedEmployees && employee.managedEmployees.length > 0) {
      managedEmployees = employee.managedEmployees.map((relation: any) =>
        plainToInstance(NoPasswordEmployeeDto, relation.employee, {
          excludeExtraneousValues: true,
        }),
      );
    }

    const returnObj: IEmployeeExternal & IEmployeeWithoutPassword = {
      ...employeeStatic,
      manager,
      managedEmployees,
    };

    await this.cacheService.set(`employee:${employeeId}`, returnObj);

    return returnObj;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.isEmployeeNotExsistThrows(id);
    const { lastName, name, position } = updateEmployeeDto;
    return await this.employeeRepository.update(id, {
      employeeLastName: lastName,
      employeeName: name,
      position,
    });
  }

  async remove(id: number) {
    await this.isEmployeeNotExsistThrows(id);
    await this.employeeRepository.delete({ employeeId: id });
    return id;
  }

  async getAllByIds(ids: number[]) {
    return await this.employeeRepository.findBy({
      employeeId: In(ids),
    });
  }
}
