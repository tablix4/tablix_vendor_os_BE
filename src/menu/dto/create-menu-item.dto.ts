import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Pizza',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    example: 'Margherita Pizza',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    example: 'Cheese loaded pizza',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 299,
  })
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiPropertyOptional({
    example: 'https://example.com/pizza.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
