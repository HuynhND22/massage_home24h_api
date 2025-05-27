import Joi from 'joi';

// Validator cho việc tạo mới service
export const createServiceSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.base': 'Tên dịch vụ phải là chuỗi',
    'string.empty': 'Tên dịch vụ không được để trống',
    'string.min': 'Tên dịch vụ phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên dịch vụ không được vượt quá {#limit} ký tự',
    'any.required': 'Tên dịch vụ là bắt buộc'
  }),
  slug: Joi.string().required().min(3).max(100).pattern(/^[a-z0-9-]+$/).messages({
    'string.base': 'Slug phải là chuỗi',
    'string.empty': 'Slug không được để trống',
    'string.min': 'Slug phải có ít nhất {#limit} ký tự',
    'string.max': 'Slug không được vượt quá {#limit} ký tự',
    'string.pattern.base': 'Slug chỉ được chứa các ký tự chữ thường, số và dấu gạch ngang',
    'any.required': 'Slug là bắt buộc'
  }),
  description: Joi.string().required().min(10).messages({
    'string.base': 'Mô tả phải là chuỗi',
    'string.empty': 'Mô tả không được để trống',
    'string.min': 'Mô tả phải có ít nhất {#limit} ký tự',
    'any.required': 'Mô tả là bắt buộc'
  }),
  price: Joi.number().required().min(0).messages({
    'number.base': 'Giá phải là số',
    'number.min': 'Giá không được nhỏ hơn {#limit}',
    'any.required': 'Giá là bắt buộc'
  }),
  duration: Joi.number().required().integer().min(1).messages({
    'number.base': 'Thời gian phải là số',
    'number.integer': 'Thời gian phải là số nguyên',
    'number.min': 'Thời gian không được nhỏ hơn {#limit} phút',
    'any.required': 'Thời gian là bắt buộc'
  }),
  image: Joi.string().allow(null, ''),
  isActive: Joi.boolean().default(true),
  translations: Joi.array().items(
    Joi.object({
      language: Joi.string().required().valid('vi', 'zh', 'ko', 'ru').messages({
        'string.base': 'Ngôn ngữ phải là chuỗi',
        'any.only': 'Ngôn ngữ phải là một trong các giá trị: vi, zh, ko, ru',
        'any.required': 'Ngôn ngữ là bắt buộc'
      }),
      name: Joi.string().required().min(3).max(100).messages({
        'string.base': 'Tên dịch vụ phải là chuỗi',
        'string.empty': 'Tên dịch vụ không được để trống',
        'string.min': 'Tên dịch vụ phải có ít nhất {#limit} ký tự',
        'string.max': 'Tên dịch vụ không được vượt quá {#limit} ký tự',
        'any.required': 'Tên dịch vụ là bắt buộc'
      }),
      description: Joi.string().required().min(10).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.empty': 'Mô tả không được để trống',
        'string.min': 'Mô tả phải có ít nhất {#limit} ký tự',
        'any.required': 'Mô tả là bắt buộc'
      })
    })
  )
});

// Validator cho việc cập nhật service
export const updateServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'Tên dịch vụ phải là chuỗi',
    'string.empty': 'Tên dịch vụ không được để trống',
    'string.min': 'Tên dịch vụ phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên dịch vụ không được vượt quá {#limit} ký tự'
  }),
  slug: Joi.string().min(3).max(100).pattern(/^[a-z0-9-]+$/).messages({
    'string.base': 'Slug phải là chuỗi',
    'string.empty': 'Slug không được để trống',
    'string.min': 'Slug phải có ít nhất {#limit} ký tự',
    'string.max': 'Slug không được vượt quá {#limit} ký tự',
    'string.pattern.base': 'Slug chỉ được chứa các ký tự chữ thường, số và dấu gạch ngang'
  }),
  description: Joi.string().min(10).messages({
    'string.base': 'Mô tả phải là chuỗi',
    'string.empty': 'Mô tả không được để trống',
    'string.min': 'Mô tả phải có ít nhất {#limit} ký tự'
  }),
  price: Joi.number().min(0).messages({
    'number.base': 'Giá phải là số',
    'number.min': 'Giá không được nhỏ hơn {#limit}'
  }),
  duration: Joi.number().integer().min(1).messages({
    'number.base': 'Thời gian phải là số',
    'number.integer': 'Thời gian phải là số nguyên',
    'number.min': 'Thời gian không được nhỏ hơn {#limit} phút'
  }),
  image: Joi.string().allow(null, ''),
  isActive: Joi.boolean(),
  translations: Joi.array().items(
    Joi.object({
      id: Joi.number(),
      language: Joi.string().valid('vi', 'zh', 'ko', 'ru').messages({
        'string.base': 'Ngôn ngữ phải là chuỗi',
        'any.only': 'Ngôn ngữ phải là một trong các giá trị: vi, zh, ko, ru'
      }),
      name: Joi.string().min(3).max(100).messages({
        'string.base': 'Tên dịch vụ phải là chuỗi',
        'string.empty': 'Tên dịch vụ không được để trống',
        'string.min': 'Tên dịch vụ phải có ít nhất {#limit} ký tự',
        'string.max': 'Tên dịch vụ không được vượt quá {#limit} ký tự'
      }),
      description: Joi.string().min(10).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.empty': 'Mô tả không được để trống',
        'string.min': 'Mô tả phải có ít nhất {#limit} ký tự'
      })
    })
  )
});
