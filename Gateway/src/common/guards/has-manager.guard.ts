import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { EmployeesRelationsService } from '../../modules/employees-relations/employees-relations.service';

@Injectable()
export class HasManagerGuard implements CanActivate {
  constructor(
    private readonly employeesRelationsService: EmployeesRelationsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const manager = await this.employeesRelationsService.getManager(
      request.userId as number,
    );

    if (!manager) {
      throw new ForbiddenException('You dont have a manager, access denied');
    }

    return true;
  }
}
