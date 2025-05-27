import { PrismaClient, Category } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

/**
 * Lấy tất cả danh mục
 */
export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

/**
 * Lấy danh mục theo ID
 * @param id ID của danh mục
 */
export const getCategoryById = async (id: number) => {
  try {
    if (isNaN(id)) {
      return null;
    }
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
          },
          take: 10
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return category;
  } catch (error) {
    console.error('Error getting category by ID:', error);
    throw error;
  }
};

/**
 * Tạo danh mục mới
 * @param data Dữ liệu danh mục
 */
export const createCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Tạo slug từ tên nếu không có
    if (!data.slug) {
      data.slug = slugify(data.name, { lower: true });
    }
    
    const category = await prisma.category.create({
      data
    });

    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Cập nhật danh mục
 * @param id ID của danh mục
 * @param data Dữ liệu cập nhật
 */
export const updateCategory = async (id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    // Cập nhật slug nếu tên thay đổi và slug không được cung cấp
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, { lower: true });
    }
    
    const category = await prisma.category.update({
      where: { id },
      data
    });

    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Xóa danh mục
 * @param id ID của danh mục
 */
export const deleteCategory = async (id: number) => {
  try {
    await prisma.category.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
