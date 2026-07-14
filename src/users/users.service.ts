import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../auth/repositories/user.repository';

import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';
import { UpdateProfileDto } from 'src/user/dto/update-profile.dto';
import { ShopRepository } from 'src/shop/repositories/shop.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly shopRepository: ShopRepository,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findProfile(userId);

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    return ApiResponse.success(Messages.PROFILE_FETCH_SUCCESS, user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.userRepository.findProfile(userId);

    if (!profile) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    await this.userRepository.updateProfile(userId, dto.name);

    if (profile.shop?.id) {
      await this.shopRepository.updateName(profile.shop.id, dto.shopName);
    }

    const updated = await this.userRepository.findProfile(userId);

    return ApiResponse.success(Messages.PROFILE_UPDATED, updated);
  }
}
