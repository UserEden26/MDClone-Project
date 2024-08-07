import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EmployeesRelationsService } from '../../modules/employees-relations/employees-relations.service';

@Injectable()
export class HasEmployeesGuard implements CanActivate {
  constructor(
    private readonly employeesRelationsService: EmployeesRelationsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const employee = await this.employeesRelationsService.getFirstEmployeeMatch(
      request.userId as number,
    );
    if (!employee) {
      return false;
    }

    return true;
  }
}
