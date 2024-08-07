import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'shared/interfaces/pagination.interface';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}
  async create(relationId: number, reportText: string) {
    const newReport = this.reportRepository.create({
      relation: { id: relationId },
      reportText,
    });

    await this.reportRepository.save(newReport);
    return newReport;
  }

  async findMyReports(managerId: number, queryParams: IPagination) {
    const { limit, page } = queryParams;
    const [results, total] = await this.reportRepository.findAndCount({
      where: { relation: { manager: { employeeId: managerId } } },
      relations: ['relation', 'relation.employee'],
      skip: (page - 1) * limit,
      take: limit,
    });
    results.forEach((i) => {
      delete i.relation.employee.hashedPassword;
      delete i.relation.id;
    });
    return {
      data: results,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Report | null> {
    return await this.reportRepository.findOne({
      where: { reportId: id },
      relations: ['relation', 'relation.employee', 'relation.manager'],
    });
  }
}
