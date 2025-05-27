import { PrismaClient, SiteSettings, SettingsTranslation } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy tất cả cài đặt
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getAllSettings = async (language?: string) => {
  try {
    const settings = await prisma.siteSettings.findMany({
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return settings;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy cài đặt theo khóa
 * @param key Khóa cài đặt
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getSettingByKey = async (key: string, language?: string) => {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return setting;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo hoặc cập nhật cài đặt
 * @param data Dữ liệu cài đặt
 */
export const upsertSetting = async (data: any) => {
  try {
    const { key, value, translations } = data;
    
    // Kiểm tra xem cài đặt đã tồn tại chưa
    const existingSetting = await prisma.siteSettings.findUnique({
      where: { key }
    });
    
    if (existingSetting) {
      // Cập nhật cài đặt hiện có
      const setting = await prisma.siteSettings.update({
        where: { key },
        data: { value }
      });
      
      // Cập nhật các bản dịch nếu có
      if (translations && translations.length > 0) {
        for (const translation of translations) {
          if (translation.id) {
            // Cập nhật bản dịch hiện có
            await prisma.settingsTranslation.update({
              where: { id: translation.id },
              data: { value: translation.value }
            });
          } else {
            // Kiểm tra xem bản dịch đã tồn tại chưa (dựa trên ngôn ngữ)
            const existingTranslation = await prisma.settingsTranslation.findFirst({
              where: {
                settingId: existingSetting.id,
                language: translation.language
              }
            });
            
            if (existingTranslation) {
              // Cập nhật bản dịch hiện có
              await prisma.settingsTranslation.update({
                where: { id: existingTranslation.id },
                data: { value: translation.value }
              });
            } else {
              // Tạo bản dịch mới
              await prisma.settingsTranslation.create({
                data: {
                  settingId: existingSetting.id,
                  language: translation.language,
                  value: translation.value
                }
              });
            }
          }
        }
      }
    } else {
      // Tạo cài đặt mới
      const setting = await prisma.siteSettings.create({
        data: {
          key,
          value,
          translations: {
            create: translations || []
          }
        }
      });
    }
    
    // Trả về cài đặt đã cập nhật hoặc tạo mới
    const updatedSetting = await prisma.siteSettings.findUnique({
      where: { key },
      include: {
        translations: true
      }
    });
    
    return updatedSetting;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa cài đặt
 * @param key Khóa cài đặt
 */
export const deleteSetting = async (key: string) => {
  try {
    const setting = await prisma.siteSettings.delete({
      where: { key }
    });
    
    return setting;
  } catch (error) {
    throw error;
  }
};
