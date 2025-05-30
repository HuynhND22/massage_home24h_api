import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Facebook',
    description: 'Name of the contact platform',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://facebook.com/spa-page',
    description: 'Value of the contact (URL, phone number, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: 'https://example.com/facebook-icon.png',
    description: 'Icon URL for the contact platform',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 1,
    description: 'Order/position of the contact',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;
}
