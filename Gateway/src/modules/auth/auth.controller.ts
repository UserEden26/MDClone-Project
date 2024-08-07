import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { JwtService } from './jwt.service';
import { EmployeeService } from '../employee/employee.service';
import { comparePasswords } from '../../utils/encrypt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly jwtService: JwtService,
    private employeeService: EmployeeService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password } = loginDto;

    const employee = await this.employeeService.findOneByEmail(email);

    const isPasswordMatch = await comparePasswords(
      password,
      employee?.hashedPassword ?? '',
    );

    if (!employee || !isPasswordMatch) {
      this.logger.error(`Failed login attempt for ${email}`);
      throw new UnauthorizedException('One or more fields are wrong');
    }

    const token = this.jwtService.generateToken({
      email,
      userId: employee?.employeeId,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
    this.logger.log(`User ${employee.employeeId} conected.`);
    return res.status(HttpStatus.OK).json({ message: 'Login successfuly' });
  }
}
