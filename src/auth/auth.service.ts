import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  CompleteProfileDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto';

import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';

import { JwtTokenService } from './services/jwt-token.service';
import { OtpService } from './services/otp.service';
import { TokenUtil } from './utils/token.util';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly mailService: MailService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    await this.otpRepository.deletePrevious(dto.email, OtpPurpose.LOGIN);

    const otp = this.otpService.generateOtp();

    const expiresAt = this.otpService.getExpiryTime();

    await this.otpRepository.create({
      email: dto.email,
      otp,
      purpose: OtpPurpose.LOGIN,
      expiresAt,
    });

    await this.mailService.sendOtp(dto.email, otp);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.otpRepository.findValidOtp(
      dto.email,
      dto.otp,
      OtpPurpose.LOGIN,
    );

    if (!otpRecord) {
      throw new NotFoundException('Invalid OTP');
    }

    if (this.otpService.isExpired(otpRecord.expiresAt)) {
      throw new BadRequestException('OTP has expired');
    }

    await this.otpRepository.markAsUsed(otpRecord.id);

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      const tempToken = this.jwtTokenService.generateTempToken(dto.email);

      return {
        success: true,
        isNewUser: true,
        tempToken,
      };
    }

    const tokens = this.jwtTokenService.generateTokens(user.id, user.email);

    const refreshTokenHash = await TokenUtil.hash(tokens.refreshToken);

    await this.userRepository.saveRefreshTokenHash(user.id, refreshTokenHash);

    return {
      success: true,
      isNewUser: false,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async completeProfile(tempToken: string, dto: CompleteProfileDto) {
    const payload = this.jwtTokenService.verifyTempToken(tempToken);

    const user = await this.userRepository.createUserWithShop(
      payload.email,
      dto.name,
      dto.shopName,
    );

    const tokens = this.jwtTokenService.generateTokens(user.id, user.email);

    const refreshTokenHash = await TokenUtil.hash(tokens.refreshToken);

    await this.userRepository.saveRefreshTokenHash(user.id, refreshTokenHash);

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = this.jwtTokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('Please login again');
    }

    const isValid = await TokenUtil.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.jwtTokenService.generateTokens(user.id, user.email);

    const refreshTokenHash = await TokenUtil.hash(tokens.refreshToken);

    await this.userRepository.saveRefreshTokenHash(user.id, refreshTokenHash);

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await this.userRepository.clearRefreshToken(userId);

    return {
      success: true,
      message: 'Logout successful',
    };
  }
}
