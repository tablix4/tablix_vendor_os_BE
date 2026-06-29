import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import {
  ACCESS_TOKEN_TYPE,
  REFRESH_TOKEN_TYPE,
  TEMP_TOKEN_TYPE,
} from '../constants/auth.constants';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private sign(
    payload: JwtPayload,
    secret: string,
    expiresIn: StringValue,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  generateAccessToken(userId: string, email: string): string {
    return this.sign(
      {
        sub: userId,
        email,
        type: ACCESS_TOKEN_TYPE,
      },
      this.configService.getOrThrow('JWT_SECRET'),
      this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    );
  }

  generateRefreshToken(userId: string, email: string): string {
    return this.sign(
      {
        sub: userId,
        email,
        type: REFRESH_TOKEN_TYPE,
      },
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    );
  }

  generateTempToken(email: string): string {
    return this.sign(
      {
        sub: '',
        email,
        type: TEMP_TOKEN_TYPE,
      },
      this.configService.getOrThrow('JWT_TEMP_SECRET'),
      this.configService.getOrThrow('JWT_TEMP_EXPIRES_IN'),
    );
  }

  generateTokens(userId: string, email: string) {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email),
    };
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });
  }

  verifyTempToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.getOrThrow('JWT_TEMP_SECRET'),
    });
  }
}
