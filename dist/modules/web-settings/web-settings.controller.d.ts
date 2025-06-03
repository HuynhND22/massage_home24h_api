import { WebSettingsService } from './web-settings.service';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';
export declare class WebSettingsController {
    private readonly webSettingsService;
    constructor(webSettingsService: WebSettingsService);
    create(req: any, createWebSettingDto: CreateWebSettingDto): Promise<unknown>;
    findOne(includeDeleted?: boolean): Promise<import("./entities/web-setting.entity").WebSetting>;
    update(id: string, req: any, updateWebSettingDto: UpdateWebSettingDto): Promise<unknown>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/web-setting.entity").WebSetting>;
}
