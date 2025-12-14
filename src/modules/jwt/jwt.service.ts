import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/payload.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  private readonly authConfig = {
    secret: process.env.JWT_AUTH_SECRET || 'authSecret',
    expiresIn:
      (process.env
        .JWT_AUTH_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd' | 'y'}`) ||
      '1d',
  };

  private readonly refreshConfig = {
    secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    expiresIn:
      (process.env
        .JWT_REFRESH_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd' | 'y'}`) ||
      '7d',
  };

  generateToken(
    payload: { email: string; sub: string },
    type: 'auth' | 'refresh' = 'auth',
  ): string {
    const config = type === 'auth' ? this.authConfig : this.refreshConfig;
    return this.jwtService.sign<Payload>(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  refreshToken(refreshToken: string): {
    accessToken: string;
    refreshToken?: string;
    payload: Payload;
  } {
    try {
      const payload = this.jwtService.verify<Payload>(refreshToken, {
        secret: this.refreshConfig.secret,
      });

      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = payload.exp ? (payload.exp - currentTime) / 60 : 0;

      if (timeToExpire < 30) {
        return {
          accessToken: this.generateToken(
            { email: payload.email, sub: payload.sub },
            'auth',
          ),
          refreshToken: this.generateToken(
            { email: payload.email, sub: payload.sub },
            'refresh',
          ),
          payload,
        };
      }

      return {
        accessToken: this.generateToken(
          { email: payload.email, sub: payload.sub },
          'auth',
        ),
        payload,
      };
    } catch {
      throw new UnauthorizedException('Token de refresh inválido o expirado');
    }
  }

  getPayload(token: string, type: 'auth' | 'refresh' = 'auth'): Payload {
    const config = type === 'auth' ? this.authConfig : this.refreshConfig;
    try {
      return this.jwtService.verify<Payload>(token, { secret: config.secret });
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
