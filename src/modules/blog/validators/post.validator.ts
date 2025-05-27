import Joi from 'joi';

// Validator cho việc tạo mới bài viết
export const createPostSchema = Joi.object({
  title: Joi.string().required().min(3).max(200).messages({
    'string.base': 'Tiêu đề phải là chuỗi',
    'string.empty': 'Tiêu đề không được để trống',
    'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
    'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự',
    'any.required': 'Tiêu đề là bắt buộc'
  }),
  slug: Joi.string().required().min(3).max(200).pattern(/^[a-z0-9-]+$/).messages({
    'string.base': 'Slug phải là chuỗi',
    'string.empty': 'Slug không được để trống',
    'string.min': 'Slug phải có ít nhất {#limit} ký tự',
    'string.max': 'Slug không được vượt quá {#limit} ký tự',
    'string.pattern.base': 'Slug chỉ được chứa các ký tự chữ thường, số và dấu gạch ngang',
    'any.required': 'Slug là bắt buộc'
  }),
  content: Joi.string().required().min(10).messages({
    'string.base': 'Nội dung phải là chuỗi',
    'string.empty': 'Nội dung không được để trống',
    'string.min': 'Nội dung phải có ít nhất {#limit} ký tự',
    'any.required': 'Nội dung là bắt buộc'
  }),
  excerpt: Joi.string().required().min(10).max(500).messages({
    'string.base': 'Tóm tắt phải là chuỗi',
    'string.empty': 'Tóm tắt không được để trống',
    'string.min': 'Tóm tắt phải có ít nhất {#limit} ký tự',
    'string.max': 'Tóm tắt không được vượt quá {#limit} ký tự',
    'any.required': 'Tóm tắt là bắt buộc'
  }),
  image: Joi.string().allow(null, ''),
  isPublished: Joi.boolean().default(false),
  author: Joi.string().allow(null, ''),
  translations: Joi.array().items(
    Joi.object({
      language: Joi.string().required().valid('vi', 'zh', 'ko', 'ru').messages({
        'string.base': 'Ngôn ngữ phải là chuỗi',
        'any.only': 'Ngôn ngữ phải là một trong các giá trị: vi, zh, ko, ru',
        'any.required': 'Ngôn ngữ là bắt buộc'
      }),
      title: Joi.string().required().min(3).max(200).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.empty': 'Tiêu đề không được để trống',
        'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
        'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự',
        'any.required': 'Tiêu đề là bắt buộc'
      }),
      content: Joi.string().required().min(10).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.empty': 'Nội dung không được để trống',
        'string.min': 'Nội dung phải có ít nhất {#limit} ký tự',
        'any.required': 'Nội dung là bắt buộc'
      }),
      excerpt: Joi.string().required().min(10).max(500).messages({
        'string.base': 'Tóm tắt phải là chuỗi',
        'string.empty': 'Tóm tắt không được để trống',
        'string.min': 'Tóm tắt phải có ít nhất {#limit} ký tự',
        'string.max': 'Tóm tắt không được vượt quá {#limit} ký tự',
        'any.required': 'Tóm tắt là bắt buộc'
      })
    })
  )
});

// Validator cho việc cập nhật bài viết
export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(200).messages({
    'string.base': 'Tiêu đề phải là chuỗi',
    'string.empty': 'Tiêu đề không được để trống',
    'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
    'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự'
  }),
  slug: Joi.string().min(3).max(200).pattern(/^[a-z0-9-]+$/).messages({
    'string.base': 'Slug phải là chuỗi',
    'string.empty': 'Slug không được để trống',
    'string.min': 'Slug phải có ít nhất {#limit} ký tự',
    'string.max': 'Slug không được vượt quá {#limit} ký tự',
    'string.pattern.base': 'Slug chỉ được chứa các ký tự chữ thường, số và dấu gạch ngang'
  }),
  content: Joi.string().min(10).messages({
    'string.base': 'Nội dung phải là chuỗi',
    'string.empty': 'Nội dung không được để trống',
    'string.min': 'Nội dung phải có ít nhất {#limit} ký tự'
  }),
  excerpt: Joi.string().min(10).max(500).messages({
    'string.base': 'Tóm tắt phải là chuỗi',
    'string.empty': 'Tóm tắt không được để trống',
    'string.min': 'Tóm tắt phải có ít nhất {#limit} ký tự',
    'string.max': 'Tóm tắt không được vượt quá {#limit} ký tự'
  }),
  image: Joi.string().allow(null, ''),
  isPublished: Joi.boolean(),
  author: Joi.string().allow(null, ''),
  translations: Joi.array().items(
    Joi.object({
      id: Joi.number(),
      language: Joi.string().valid('vi', 'zh', 'ko', 'ru').messages({
        'string.base': 'Ngôn ngữ phải là chuỗi',
        'any.only': 'Ngôn ngữ phải là một trong các giá trị: vi, zh, ko, ru'
      }),
      title: Joi.string().min(3).max(200).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.empty': 'Tiêu đề không được để trống',
        'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự',
        'string.max': 'Tiêu đề không được vượt quá {#limit} ký tự'
      }),
      content: Joi.string().min(10).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.empty': 'Nội dung không được để trống',
        'string.min': 'Nội dung phải có ít nhất {#limit} ký tự'
      }),
      excerpt: Joi.string().min(10).max(500).messages({
        'string.base': 'Tóm tắt phải là chuỗi',
        'string.empty': 'Tóm tắt không được để trống',
        'string.min': 'Tóm tắt phải có ít nhất {#limit} ký tự',
        'string.max': 'Tóm tắt không được vượt quá {#limit} ký tự'
      })
    })
  )
});
