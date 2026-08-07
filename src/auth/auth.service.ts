import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';

import {
  CompleteProfileDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';

import { JwtTokenService } from './services/jwt-token.service';
import { OtpService } from './services/otp.service';

import { MailService } from './mail/mail.service';

import { TokenUtil } from './utils/token.util';

import { ApiResponse } from '../common/utils/api-response';
import { Messages } from 'src/common/constants/messages';

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
    console.log('???????????????', dto.email);
    // await this.otpRepository.deletePrevious(dto.email, OtpPurpose.LOGIN);
    // console.log('deletePrevious');

    const otp = this.otpService.generateOtp();
    console.log('otp', otp);

    const expiresAt = this.otpService.getExpiryTime();
    console.log('expiresAt', expiresAt);

    await this.otpRepository.create({
      email: dto.email,
      otp,
      purpose: OtpPurpose.LOGIN,
      expiresAt,
    });
    console.log('create');
    await this.mailService.sendOtp(dto.email, otp);
    console.log('sendOtp');
    return ApiResponse.success(Messages.OTP_SENT);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.otpRepository.findValidOtp(
      dto.email,
      dto.otp,
      OtpPurpose.LOGIN,
    );

    if (!otpRecord) {
      throw new NotFoundException(Messages.INVALID_OTP);
    }

    if (this.otpService.isExpired(otpRecord.expiresAt)) {
      throw new BadRequestException(Messages.OTP_EXPIRED);
    }

    await this.otpRepository.markAsUsed(otpRecord.id);

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      const tempToken = this.jwtTokenService.generateTempToken(dto.email);

      return ApiResponse.success(Messages.OTP_VERIFIED, {
        isNewUser: true,
        tempToken,
      });
    }

    const tokens = this.jwtTokenService.generateTokens(user.id, user.email);

    const refreshTokenHash = await TokenUtil.hash(tokens.refreshToken);

    await this.userRepository.saveRefreshTokenHash(user.id, refreshTokenHash);

    return ApiResponse.success(Messages.LOGIN_SUCCESS, {
      isNewUser: false,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    });
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

    return ApiResponse.success(Messages.PROFILE_COMPLETED, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    });
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = this.jwtTokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedException(Messages.INVALID_EXPIRE_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(Messages.INVALID_REFRESH_TOKEN);
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException(Messages.LOGIN_AGAIN);
    }

    const isValid = await TokenUtil.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValid) {
      throw new UnauthorizedException(Messages.INVALID_REFRESH_TOKEN);
    }

    const tokens = this.jwtTokenService.generateTokens(user.id, user.email);

    const refreshTokenHash = await TokenUtil.hash(tokens.refreshToken);

    await this.userRepository.saveRefreshTokenHash(user.id, refreshTokenHash);

    return ApiResponse.success(Messages.TOKEN_REFRESH_SUCCESS, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async logout(userId: string) {
    await this.userRepository.clearRefreshToken(userId);

    return ApiResponse.success(Messages.LOGOUT_SUCCESS);
  }
}
