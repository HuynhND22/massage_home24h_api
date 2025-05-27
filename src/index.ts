import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Import routes
import serviceRoutes from './modules/services/routes';
import blogRoutes from './modules/blog/routes';
import contactRoutes from './modules/contact/routes';
import userRoutes from './modules/users/routes';
import settingsRoutes from './modules/settings/routes';
import categoriesRoutes from './modules/categories/routes';
import createAdmin from './utils/create-admin';

// Load environment variables
dotenv.config();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Cấu hình CORS riêng trước tất cả middleware khác
app.use((req, res, next) => {
  // Cấu hình CORS để chấp nhận cả cổng 5173 và 5174
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Xử lý OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});



// Điều chỉnh helmet để không block CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thư mục uploads cho file tĩnh
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadsDir)));

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Spa Renew API',
    version: '1.0.0',
    endpoints: {
      services: '/api/services',
      blog: '/api/blog',
      contact: '/api/contact',
      users: '/api/users',
      settings: '/api/settings',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}`);
});

// check DB users empty then create admin
(async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await createAdmin();
    } else {
      console.log('Admin already exists, skipping creation');
    }
  } catch (error) {
    console.error('Error checking user count or creating admin:', error);
  }
})();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});
