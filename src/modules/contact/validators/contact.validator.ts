import Joi from 'joi';

// Validator cho việc gửi tin nhắn liên hệ
export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).messages({
    'string.base': 'Tên phải là chuỗi',
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên không được vượt quá {#limit} ký tự',
    'any.required': 'Tên là bắt buộc'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email phải là chuỗi',
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  phone: Joi.string().allow(null, '').pattern(/^[0-9+\-\s()]{7,20}$/).messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ'
  }),
  message: Joi.string().required().min(10).messages({
    'string.base': 'Tin nhắn phải là chuỗi',
    'string.empty': 'Tin nhắn không được để trống',
    'string.min': 'Tin nhắn phải có ít nhất {#limit} ký tự',
    'any.required': 'Tin nhắn là bắt buộc'
  })
});
