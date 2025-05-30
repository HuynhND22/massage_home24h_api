import { PartialType } from '@nestjs/swagger';
import { CreateWebSettingDto } from './create-web-setting.dto';

export class UpdateWebSettingDto extends PartialType(CreateWebSettingDto) {}
