import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CompleteProfileDto {
  @ApiProperty({
    example: 'Harshad Patoliya',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Harshad Fast Food',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  shopName!: string;
}
