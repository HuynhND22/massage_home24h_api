import Joi from 'joi';

// Validator cho đăng ký tài khoản mới
export const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
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
  password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
    'string.base': 'Mật khẩu phải là chuỗi',
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'string.pattern.base': 'Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Xác nhận mật khẩu không khớp',
    'any.required': 'Xác nhận mật khẩu là bắt buộc'
  }),
  role: Joi.string().valid('user', 'admin').default('user')
});

// Validator cho đăng nhập
export const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.base': 'Email phải là chuỗi',
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().required().messages({
    'string.base': 'Mật khẩu phải là chuỗi',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc'
  })
});

// Validator cho cập nhật thông tin người dùng
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'Tên phải là chuỗi',
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất {#limit} ký tự',
    'string.max': 'Tên không được vượt quá {#limit} ký tự'
  }),
  isActive: Joi.boolean(),
  role: Joi.string().valid('user', 'admin')
});

// Validator cho thay đổi mật khẩu
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.base': 'Mật khẩu hiện tại phải là chuỗi',
    'string.empty': 'Mật khẩu hiện tại không được để trống',
    'any.required': 'Mật khẩu hiện tại là bắt buộc'
  }),
  newPassword: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
    'string.base': 'Mật khẩu mới phải là chuỗi',
    'string.empty': 'Mật khẩu mới không được để trống',
    'string.min': 'Mật khẩu mới phải có ít nhất {#limit} ký tự',
    'string.pattern.base': 'Mật khẩu mới phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một số và một ký tự đặc biệt',
    'any.required': 'Mật khẩu mới là bắt buộc'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
    'any.only': 'Xác nhận mật khẩu không khớp',
    'any.required': 'Xác nhận mật khẩu là bắt buộc'
  })
});
