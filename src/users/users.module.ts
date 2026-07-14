import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
