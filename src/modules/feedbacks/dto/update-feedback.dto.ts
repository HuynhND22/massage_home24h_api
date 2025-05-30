import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @ApiProperty({
    example: true,
    description: 'Whether the feedback has been read',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
