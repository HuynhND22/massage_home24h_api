import { PrismaClient, Post, PostTranslation } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy tất cả bài viết
 * @param language Ngôn ngữ (tùy chọn)
 * @param page Trang hiện tại
 * @param limit Số lượng bài viết trên một trang
 * @param publishedOnly Chỉ lấy bài viết đã xuất bản
 */
export const getAllPosts = async (language?: string, page = 1, limit = 10, publishedOnly = false) => {
  try {
    const skip = (page - 1) * limit;
    
    const where = publishedOnly ? { isPublished: true } : {};
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          translations: language 
            ? { where: { language } } 
            : true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    return {
      posts,
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
 * Lấy bài viết theo ID
 * @param id ID của bài viết
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getPostById = async (id: number, language?: string) => {
  try {
    if (isNaN(id)) {
      return null;
    }
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return post;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy bài viết theo slug
 * @param slug Slug của bài viết
 * @param language Ngôn ngữ (tùy chọn)
 */
export const getPostBySlug = async (slug: string, language?: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        translations: language 
          ? { where: { language } } 
          : true
      }
    });

    return post;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo mới bài viết
 * @param data Dữ liệu bài viết
 */
export const createPost = async (data: any) => {
  try {
    // Tách translations và loại bỏ category nếu có categoryId
    const { translations, category, ...postData } = data;
    
    // Xử lý trường categoryId - loại bỏ khỏi dữ liệu chính và tạo mối quan hệ
    let postWithRelations;
    if (postData.categoryId) {
      const { categoryId, ...restPostData } = postData;
      postWithRelations = {
        ...restPostData,
        category: {
          connect: { id: Number(categoryId) }
        }
      };
    } else {
      postWithRelations = postData;
    }
    
    // Đảm bảo mỗi bản dịch có trường excerpt
    const translationsWithExcerpt = translations
      ? translations.map((translation: any) => ({
          ...translation,
          excerpt: translation.excerpt || ''
        }))
      : [];

    const post = await prisma.post.create({
      data: {
        ...postWithRelations,
        translations: {
          create: translationsWithExcerpt
        }
      },
      include: {
        translations: true,
        category: true
      }
    });

    return post;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật bài viết
 * @param id ID của bài viết
 * @param data Dữ liệu cập nhật
 */
export const updatePost = async (id: number, data: any) => {
  try {
    // Tách translations và loại bỏ category nếu có categoryId
    const { translations, category, ...postData } = data;
    
    // Xử lý trường categoryId - loại bỏ khỏi dữ liệu chính và tạo mối quan hệ
    let postWithRelations;
    if (postData.categoryId) {
      const { categoryId, ...restPostData } = postData;
      postWithRelations = {
        ...restPostData,
        category: {
          connect: { id: Number(categoryId) }
        }
      };
    } else {
      postWithRelations = postData;
    }
    
    // Update post data
    const post = await prisma.post.update({
      where: { id },
      data: postWithRelations
    });

    // Update translations if provided
    if (translations && translations.length > 0) {
      // Process each translation
      for (const translation of translations) {
        if (translation.id) {
          // Update existing translation
          await prisma.postTranslation.update({
            where: { id: translation.id },
            data: {
              title: translation.title,
              content: translation.content,
              excerpt: translation.excerpt
            }
          });
        } else {
          // Kiểm tra xem bản dịch đã tồn tại chưa
          const existingTranslation = await prisma.postTranslation.findFirst({
            where: {
              postId: id,
              language: translation.language
            }
          });
          
          if (existingTranslation) {
            // Cập nhật bản dịch hiện có
            await prisma.postTranslation.update({
              where: { id: existingTranslation.id },
              data: {
                title: translation.title,
                content: translation.content,
                excerpt: translation.excerpt || ''
              }
            });
          } else {
            // Tạo bản dịch mới
            await prisma.postTranslation.create({
              data: {
                postId: id,
                language: translation.language,
                title: translation.title,
                content: translation.content,
                excerpt: translation.excerpt || '' // Thêm trường excerpt với giá trị mặc định là chuỗi rỗng
              }
            });
          }
        }
      }
    }

    // Return updated post with translations
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      include: {
        translations: true
      }
    });

    return updatedPost;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa bài viết
 * @param id ID của bài viết
 */
export const deletePost = async (id: number) => {
  try {
    // Prisma sẽ tự động xóa các bản dịch liên quan nhờ vào onDelete: Cascade
    const post = await prisma.post.delete({
      where: { id }
    });

    return post;
  } catch (error) {
    throw error;
  }
};
