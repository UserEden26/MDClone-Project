import { IsEmail, IsString, Length } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsString()
  @Length(2, 255)
  position: string;

  @IsString()
  @IsEmail()
  @Length(10, 50)
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;
}
