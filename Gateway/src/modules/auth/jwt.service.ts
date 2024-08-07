import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'shared/interfaces/jwt.interface';

@Injectable()
export class JwtService {
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('SECRET_KEY');
  }

  generateToken(payload: JwtPayload, expiresIn: string = '1h'): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new Error('Token verification failed');
    }
  }
}
