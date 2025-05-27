import Joi from 'joi';

// Validator cho việc tạo/cập nhật cài đặt
export const settingsSchema = Joi.object({
  key: Joi.string().required().messages({
    'string.base': 'Khóa phải là chuỗi',
    'string.empty': 'Khóa không được để trống',
    'any.required': 'Khóa là bắt buộc'
  }),
  value: Joi.string().required().messages({
    'string.base': 'Giá trị phải là chuỗi',
    'string.empty': 'Giá trị không được để trống',
    'any.required': 'Giá trị là bắt buộc'
  }),
  translations: Joi.array().items(
    Joi.object({
      id: Joi.number(),
      language: Joi.string().required().valid('vi', 'zh', 'ko', 'ru').messages({
        'string.base': 'Ngôn ngữ phải là chuỗi',
        'any.only': 'Ngôn ngữ phải là một trong các giá trị: vi, zh, ko, ru',
        'any.required': 'Ngôn ngữ là bắt buộc'
      }),
      value: Joi.string().required().messages({
        'string.base': 'Giá trị phải là chuỗi',
        'string.empty': 'Giá trị không được để trống',
        'any.required': 'Giá trị là bắt buộc'
      })
    })
  )
});
