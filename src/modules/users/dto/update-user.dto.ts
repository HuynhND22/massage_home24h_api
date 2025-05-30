import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'newpassword123',
    description: 'New password of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  newPassword?: string;

  @ApiProperty({
    example: 'currentpassword123',
    description: 'Current password for verification when changing password',
    required: false,
  })
  @IsString()
  @IsOptional()
  currentPassword?: string;
}
