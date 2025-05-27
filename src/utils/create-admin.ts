import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const createAdmin =  async () => {
  try {
    // Xóa tất cả người dùng hiện tại
    await prisma.user.deleteMany();
    
    // Tạo mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    
    // Tạo admin mới
    const admin = await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    });
    
    console.log('Admin đã được tạo:');
    console.log('Email: admin@home24h.com');
    console.log('Password: Admin123!');
    console.log('Hash mật khẩu:', hashedPassword);
  } catch (error) {
    console.error('Lỗi khi tạo admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default createAdmin;