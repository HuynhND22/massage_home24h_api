import { Repository } from 'typeorm';
import { WebSetting } from './entities/web-setting.entity';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';
export declare class WebSettingsService {
    private webSettingsRepository;
    constructor(webSettingsRepository: Repository<WebSetting>);
    create(createWebSettingDto: CreateWebSettingDto): Promise<WebSetting>;
    findOne(includeDeleted?: boolean): Promise<WebSetting>;
    update(id: string, updateWebSettingDto: UpdateWebSettingDto): Promise<WebSetting>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<WebSetting>;
}
