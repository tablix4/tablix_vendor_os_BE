import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';
import { UpdateProfileDto } from 'src/user/dto/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get My Profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully',
  })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update Profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.id, dto);
  }
}
