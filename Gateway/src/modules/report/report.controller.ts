import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
  Req,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { HasManagerGuard } from '../../common/guards/has-manager.guard';
import { NoAdminGuard } from '../../common/guards/no-admin.guard';
import { EmployeesRelationsService } from '../employees-relations/employees-relations.service';
import { Request } from 'express';
import { PaginationDto } from '../../shared/pagination-dto';

@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    @Inject() private employeeRelationService: EmployeesRelationsService,
  ) {}

  @Get('/my-reports')
  @UseGuards(NoAdminGuard)
  async findMyReports(
    @Query() paginationDto: PaginationDto,
    @Req() request: Request,
  ) {
    return await this.reportService.findMyReports(
      request.userId as number,
      paginationDto,
    );
  }

  @Get('/employee/:id')
  async findOne(
    @Param('id', ParseIntPipe) reportId: number,
    @Req() request: Request,
  ) {
    const report = await this.reportService.findOne(reportId);
    if (!report) {
      throw new NotFoundException('Report was not found');
    }
    if (
      ![
        report.relation.employee.employeeId,
        report.relation.manager.employeeId,
      ].includes(request.userId as number)
    ) {
      throw new BadRequestException('You are not include in this report');
    }
    delete report.relation;
    return report;
  }

  @Post()
  @UseGuards(NoAdminGuard, HasManagerGuard)
  async create(
    @Body() createReportDto: CreateReportDto,
    @Req() request: Request,
  ) {
    const relation = await this.employeeRelationService.getRlation(
      createReportDto.employeeId,
      request.userId as number,
    );
    if (!relation) {
      throw new NotFoundException('This connection does not exist');
    }
    return await this.reportService.create(
      relation.id,
      createReportDto.reportText,
    );
  }
}
