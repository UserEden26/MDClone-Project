import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ManagerEmployee } from './employees-relations.entity';
import { CreateEmployeesRelationDto } from './dto/create-employees-relation.dto';
import { EmployeeService } from '../employee/employee.service';
import { isNotExsistThrows } from '../../utils/isNotExsistThrows';

import {
  IEmployeeExternal,
  IEmployeeWithoutPassword,
} from 'shared/interfaces/employee.interface';
import { Employee } from '../employee/employee.entity';
import { IReturnPagination } from 'shared/interfaces/pagination.interface';
import { CacheService } from '../cache/cache.service';
import { PaginationDto } from '../../shared/pagination-dto';
import { plainToInstance } from 'class-transformer';
import { NoPasswordEmployeeDto } from '../../shared/no-password-employee.dto';

@Injectable()
export class EmployeesRelationsService {
  constructor(
    @InjectRepository(ManagerEmployee)
    private managerEmployeeRelationRepository: Repository<ManagerEmployee>,
    private employeeService: EmployeeService,
    @Inject() private cacheService: CacheService,
  ) {}

  async createRelations(createRelationDto: CreateEmployeesRelationDto) {
    const { managerId, employeeIds } = createRelationDto;

    // Ensure manager exists
    const manager =
      await this.employeeService.isEmployeeNotExsistThrows(managerId);

    // Ensure all employees exist
    const employees = await this.employeeService.getAllByIds(employeeIds);

    if (employees.length !== employeeIds.length) {
      throw new NotFoundException('One or more employee IDs are invalid');
    }

    const existingRelations = await this.managerEmployeeRelationRepository.find(
      {
        where: {
          manager: { employeeId: managerId },
          employee: { employeeId: In(employeeIds) },
        },
        relations: ['employee'],
      },
    );

    const existingEmployeeIds = existingRelations.map(
      (rel) => rel.employee.employeeId,
    );

    const newEmployeeIds = employeeIds.filter(
      (id) => !existingEmployeeIds.includes(id),
    );

    if (newEmployeeIds.length === 0) {
      throw new BadRequestException(
        'All specified employees are already managed by this manager',
      );
    }

    // Create new relations
    const newRelations = newEmployeeIds.map((employeeId) => {
      return this.managerEmployeeRelationRepository.create({
        manager,
        employee: employees.find((emp) => emp.employeeId === employeeId),
      });
    });
    await this.managerEmployeeRelationRepository.save(newRelations);

    await this.updateRelationInCache(
      newRelations.map((emp) => this.employeeTransform(emp.employee)),
      this.employeeTransform(manager),
    );

    return newRelations;
  }

  async deleteAllManagerRelations(id: number) {
    const manager = await this.employeeService.isEmployeeNotExsistThrows(id);
    isNotExsistThrows({
      value: await this.managerEmployeeRelationRepository.findOneBy({
        manager,
      }),
      message: "This employee don't have any employees",
    });
    const relations = await this.managerEmployeeRelationRepository.findBy({
      manager,
    });

    await this.managerEmployeeRelationRepository.remove(relations);
    return 'delete';
  }

  async noRelations(employeeId: number) {
    const employee =
      await this.employeeService.isEmployeeNotExsistThrows(employeeId);
    return {
      manager: null,
      managedEmployees: [],
      employeeId: employee.employeeId,
      employeeLastName: employee.employeeLastName,
      hashedPassword: employee.hashedPassword,
      employeeName: employee.employeeName,
      position: employee.position,
      email: employee.email,
    };
  }

  async getManager(employeeId: number) {
    const fromCahce = await this.cacheService.getEmployee(employeeId);
    if (fromCahce) {
      return fromCahce.manager;
    }
    const relation = await this.managerEmployeeRelationRepository.findOne({
      where: { employee: { employeeId } },
      relations: ['manager'],
    });
    return relation ? this.employeeTransform(relation.manager) : null;
  }

  async getAllEmployees(employeeId: number) {
    const managedEmployeesRelations =
      await this.managerEmployeeRelationRepository.find({
        where: { manager: { employeeId } },
        relations: ['employee'],
      });

    const managedEmployees = managedEmployeesRelations.map(
      (rel) => rel.employee,
    );
    return managedEmployees;
  }

  async getManagerEmployeesPagenation(
    managerId: number,
    queryParams: PaginationDto,
  ): Promise<IReturnPagination<IEmployeeWithoutPassword>> {
    const { limit, page } = queryParams;
    const [results, total] =
      await this.managerEmployeeRelationRepository.findAndCount({
        where: { manager: { employeeId: managerId } },
        relations: ['employee'],
        skip: (page - 1) * limit,
        take: limit,
      });
    const employees = results.map((rel) =>
      this.employeeTransform(rel.employee),
    );

    return {
      data: employees,
      total,
      page,
      limit,
    };
  }

  async getFirstEmployeeMatch(employeeId: number) {
    const cacheEmployee = await this.cacheService.getEmployee(employeeId);

    if (cacheEmployee && cacheEmployee.managedEmployees) {
      return cacheEmployee.managedEmployees[0];
    }
    const relation = await this.managerEmployeeRelationRepository.findOneBy({
      manager: { employeeId },
    });
    return relation;
  }

  employeeTransform(emp: Employee | null): IEmployeeWithoutPassword | null {
    return emp
      ? plainToInstance(NoPasswordEmployeeDto, emp, {
          excludeExtraneousValues: true,
        })
      : null;
  }

  async getManagerAndEmployees(
    employeeId: number,
  ): Promise<IEmployeeExternal & IEmployeeWithoutPassword> {
    const employeeWithRelations =
      await this.employeeService.findEmployeeRelations(employeeId);

    if (!employeeWithRelations) {
      throw new NotFoundException(
        `Employee with id ${employeeId} was not found`,
      );
    }

    return employeeWithRelations;
  }

  async updateRelationInCache(
    emps: IEmployeeWithoutPassword[],
    manager: IEmployeeWithoutPassword,
  ) {
    const managerCache = await this.cacheService.getEmployee(
      manager.employeeId,
    );
    if (managerCache) {
      managerCache.managedEmployees = [
        ...managerCache.managedEmployees,
        ...emps,
      ];
      await this.cacheService.set(
        `employee:${managerCache.employeeId}`,
        managerCache,
      );
    }

    for (const i of emps) {
      const empCache = await this.cacheService.getEmployee(i.employeeId);
      if (empCache) {
        empCache.manager = manager;
        await this.cacheService.set(
          `employee:${empCache.employeeId}`,
          empCache,
        );
      }
    }
  }

  async getRlation(managerId: number, employeeId: number) {
    if (managerId === employeeId) {
      throw new BadRequestException('You can not have relation with yourself');
    }
    const relation = await this.managerEmployeeRelationRepository.findOne({
      where: { manager: { employeeId: managerId }, employee: { employeeId } },
    });
    return relation;
  }
}
