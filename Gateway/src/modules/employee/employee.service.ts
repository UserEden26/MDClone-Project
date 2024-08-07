import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { isNotExsistThrows } from '../../utils/isNotExsistThrows';
import { hashPassword } from '../../utils/encrypt';
import { excludeColumns } from '../../utils/excludeColumns';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { IPagination } from 'shared/interfaces/pagination.interface';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async isEmployeeNotExsistThrows(id: number): Promise<Employee> {
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

  async findAllByPages(queryParams: IPagination) {
    const { limit, page } = queryParams;
    const [results, total] = await this.employeeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const finalResults = results.map((emp) =>
      excludeColumns(emp, ['hashedPassword']),
    );
    return {
      data: finalResults,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Employee | null> {
    const cahceEmployee = await this.cacheManager.get<Employee>(
      `employee:${id}`,
    );

    if (cahceEmployee) {
      return cahceEmployee;
    }

    const employee = await this.employeeRepository.findOneBy({
      employeeId: id,
    });

    return employee;
  }

  async findOneByEmail(email: string): Promise<Employee | null> {
    const cahceUser = await this.cacheManager.get<Employee>(email);
    if (cahceUser) {
      return cahceUser;
    }
    const dbEmployee = await this.employeeRepository.findOneBy({
      email,
    });

    await this.cacheManager.set(email, dbEmployee);
    return dbEmployee;
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
