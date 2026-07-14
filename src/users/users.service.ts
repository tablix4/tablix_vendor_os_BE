import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../auth/repositories/user.repository';

import { ApiResponse } from '../common/utils/api-response';
import { Messages } from '../common/constants/messages';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findProfile(userId);

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    return ApiResponse.success(Messages.PROFILE_FETCH_SUCCESS, user);
  }
}
