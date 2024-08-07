import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { IPagination } from 'shared/interfaces/pagination.interface';

export class PaginationDto implements IPagination {
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  forEmp?: number;
}
