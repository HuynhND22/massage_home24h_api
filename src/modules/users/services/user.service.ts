import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../../config/env';

const prisma = new PrismaClient();

/**
 * Đăng ký người dùng mới
 * @param userData Dữ liệu người dùng
 */
export const register = async (userData: any) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Loại bỏ confirmPassword khỏi dữ liệu
    const { confirmPassword, ...data } = userData;

    // Tạo người dùng mới
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });

    // Không trả về mật khẩu
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

/**
 * Đăng nhập người dùng
 * @param email Email
 * @param password Mật khẩu
 */
export const login = async (email: string, password: string) => {
  try {
    // Tìm người dùng theo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    // Kiểm tra xem tài khoản có bị vô hiệu hóa không
    if (!user.isActive) {
      throw new Error('Tài khoản đã bị vô hiệu hóa');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid', isPasswordValid);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('hashedPassword', hashedPassword);

    if (!isPasswordValid) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    // Không trả về mật khẩu
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy tất cả người dùng
 */
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return users;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy người dùng theo ID
 * @param id ID của người dùng
 */
export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param id ID của người dùng
 * @param data Dữ liệu cập nhật
 */
export const updateUser = async (id: number, data: any) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Thay đổi mật khẩu
 * @param id ID của người dùng
 * @param currentPassword Mật khẩu hiện tại
 * @param newPassword Mật khẩu mới
 */
export const changePassword = async (id: number, currentPassword: string, newPassword: string) => {
  try {
    // Tìm người dùng theo ID
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Mật khẩu hiện tại không chính xác');
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa người dùng
 * @param id ID của người dùng
 */
export const deleteUser = async (id: number) => {
  try {
    const user = await prisma.user.delete({
      where: { id }
    });

    return user;
  } catch (error) {
    throw error;
  }
};
