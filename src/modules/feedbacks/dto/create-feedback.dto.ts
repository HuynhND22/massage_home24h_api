import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the person providing feedback',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the person providing feedback',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the person providing feedback',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Great service',
    description: 'Subject of the feedback',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'I had a wonderful experience at your spa...',
    description: 'Message content of the feedback',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '2025-05-20T14:00:00Z',
    description: 'Date when the person used the service',
    required: false,
  })
  @IsOptional()
  serviceDate?: Date;
}
