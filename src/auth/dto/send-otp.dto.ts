import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'vendor@example.com',
    description: 'Vendor email address',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email!: string;
}
