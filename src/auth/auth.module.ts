import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './services/otp.service';
import { JwtTokenService } from './services/jwt-token.service';
import { MailService } from './mail/mail.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    OtpRepository,
    OtpService,
    JwtTokenService,
    MailService,
    JwtStrategy,
  ],
  exports: [JwtTokenService, UserRepository],
})
export class AuthModule {}
