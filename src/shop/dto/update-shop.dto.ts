import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateShopDto {
  @ApiPropertyOptional({
    example: 'Om Vendor',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'https://domain.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;
}
