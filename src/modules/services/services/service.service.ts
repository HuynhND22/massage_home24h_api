import { PrismaClient, Service, ServiceTranslation } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy tất cả dịch vụ
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getAllServices = async (language?: string) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      },
      orderBy: {
        id: 'asc'
      }
    });

    return services;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy dịch vụ theo ID
 * @param id ID của dịch vụ
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getServiceById = async (id: number, language?: string) => {
  try {
    if (isNaN(id)) {
      return null;
    }
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return service;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy dịch vụ theo slug
 * @param slug Slug của dịch vụ
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getServiceBySlug = async (slug: string, language?: string) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return service;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo mới dịch vụ
 * @param data Dữ liệu dịch vụ
 */
export const createService = async (data: any) => {
  try {
    console.log('Service data received:', data);
    
    let translations;
    // Kiểm tra nếu translations là chuỗi JSON
    if (data.translations && typeof data.translations === 'string') {
      try {
        translations = JSON.parse(data.translations);
        console.log('Parsed translations:', translations);
      } catch (e) {
        console.error('Error parsing translations:', e);
        translations = [];
      }
    } else {
      translations = data.translations || [];
    }
    
    // Loại bỏ translations khỏi serviceData
    const { translations: _, ...serviceData } = data;
    
    // Đảm bảo isActive là boolean
    if (serviceData.isActive && typeof serviceData.isActive === 'string') {
      serviceData.isActive = serviceData.isActive === 'true';
    }
    
    // Đảm bảo price và duration là số
    if (serviceData.price) serviceData.price = parseFloat(serviceData.price);
    if (serviceData.duration) serviceData.duration = parseInt(serviceData.duration);
    
    console.log('Creating service with data:', { ...serviceData, translations });
    
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        translations: {
          create: translations
        }
      },
      include: {
        translations: true
      }
    });

    return service;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Cập nhật dịch vụ
 * @param id ID của dịch vụ
 * @param data Dữ liệu cập nhật
 */
export const updateService = async (id: number, data: any) => {
  try {
    console.log('Update service data received:', data);
    
    let translations;
    // Kiểm tra nếu translations là chuỗi JSON
    if (data.translations && typeof data.translations === 'string') {
      try {
        translations = JSON.parse(data.translations);
        console.log('Parsed translations for update:', translations);
      } catch (e) {
        console.error('Error parsing translations for update:', e);
        translations = [];
      }
    } else {
      translations = data.translations || [];
    }
    
    // Loại bỏ translations khỏi serviceData
    const { translations: _, ...serviceData } = data;
    
    // Đảm bảo isActive là boolean
    if (serviceData.isActive && typeof serviceData.isActive === 'string') {
      serviceData.isActive = serviceData.isActive === 'true';
    }
    
    // Đảm bảo price và duration là số
    if (serviceData.price) serviceData.price = parseFloat(serviceData.price);
    if (serviceData.duration) serviceData.duration = parseInt(serviceData.duration);
    
    console.log('Updating service with data:', { id, ...serviceData });
    
    // Cập nhật dữ liệu dịch vụ
    const service = await prisma.service.update({
      where: { id },
      data: serviceData
    });

    // Xóa tất cả bản dịch hiện tại để thêm mới hoàn toàn
    // Đơn giản hóa quy trình và tránh các vấn đề phức tạp với việc cập nhật từng bản dịch
    await prisma.serviceTranslation.deleteMany({
      where: { serviceId: id }
    });
    
    // Thêm lại các bản dịch
    if (translations && translations.length > 0) {
      for (const translation of translations) {
        await prisma.serviceTranslation.create({
          data: {
            serviceId: id,
            language: translation.language,
            name: translation.name || '',
            description: translation.description || ''
          }
        });
      }
    }

    // Trả về dịch vụ đã cập nhật kèm bản dịch
    const updatedService = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true
      }
    });

    return updatedService;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa dịch vụ
 * @param id ID của dịch vụ
 */
export const deleteService = async (id: number) => {
  try {
    // Prisma sẽ tự động xóa các bản dịch liên quan nhờ vào onDelete: Cascade
    const service = await prisma.service.delete({
      where: { id }
    });

    return service;
  } catch (error) {
    throw error;
  }
};
