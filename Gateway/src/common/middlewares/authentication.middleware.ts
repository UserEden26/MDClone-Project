import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../modules/auth/jwt.service';
import { JwtPayload } from 'shared/interfaces/jwt.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const specificHeader = req.headers['x-custom-header'];
    const authHeader = req.cookies['access_token'];

    if (specificHeader && specificHeader === process.env.CUSTOM_HEADER) {
      req.userId = 'ADMIN';
      this.logger.log('User request as Admin');
      return next();
    }

    let verifyToken, userId: number;
    if (authHeader) {
      try {
        verifyToken = this.jwtService.verifyToken(authHeader);
        userId = (verifyToken as JwtPayload).userId;
        this.logger.log(`User id:${userId}`);
        req.userId = userId;
      } catch (err) {
        this.logger.error(`Fail to verify token: ${authHeader}`);
        res.clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
        throw new UnauthorizedException('Unauthorized access');
      }
      return next();
    }

    throw new UnauthorizedException('Unauthorized access');
  }
}
