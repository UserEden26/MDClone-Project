import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { IsTimestampWithTZ } from 'src/common/decorators/isDateWithTZ.decorator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  reportText: string;

  @IsNotEmpty()
  @IsTimestampWithTZ()
  reportDate: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  employeeId: number;
}
