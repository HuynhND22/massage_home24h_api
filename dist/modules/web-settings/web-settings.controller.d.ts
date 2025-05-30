import { WebSettingsService } from './web-settings.service';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';
export declare class WebSettingsController {
    private readonly webSettingsService;
    constructor(webSettingsService: WebSettingsService);
    create(createWebSettingDto: CreateWebSettingDto): Promise<import("./entities/web-setting.entity").WebSetting>;
    findOne(includeDeleted?: boolean): Promise<import("./entities/web-setting.entity").WebSetting>;
    update(id: string, updateWebSettingDto: UpdateWebSettingDto): Promise<import("./entities/web-setting.entity").WebSetting>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/web-setting.entity").WebSetting>;
}
