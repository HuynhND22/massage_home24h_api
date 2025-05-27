import { PrismaClient, Contact } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy tất cả tin nhắn liên hệ
 * @param page Trang hiện tại
 * @param limit Số lượng tin nhắn trên một trang
 * @param isRead Lọc theo trạng thái đã đọc
 */
export const getAllContacts = async (page = 1, limit = 10, isRead?: boolean) => {
  try {
    const skip = (page - 1) * limit;
    
    const where = isRead !== undefined ? { isRead } : {};
    
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.contact.count({ where })
    ]);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy tin nhắn liên hệ theo ID
 * @param id ID của tin nhắn
 */
export const getContactById = async (id: number) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    return contact;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo mới tin nhắn liên hệ
 * @param data Dữ liệu tin nhắn
 */
export const createContact = async (data: any) => {
  try {
    const contact = await prisma.contact.create({
      data
    });

    return contact;
  } catch (error) {
    throw error;
  }
};

/**
 * Đánh dấu tin nhắn đã đọc
 * @param id ID của tin nhắn
 */
export const markAsRead = async (id: number) => {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: { isRead: true }
    });

    return contact;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa tin nhắn liên hệ
 * @param id ID của tin nhắn
 */
export const deleteContact = async (id: number) => {
  try {
    const contact = await prisma.contact.delete({
      where: { id }
    });

    return contact;
  } catch (error) {
    throw error;
  }
};
