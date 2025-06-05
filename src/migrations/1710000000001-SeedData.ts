import { MigrationInterface, QueryRunner } from 'typeorm';
import { CategoryType } from '../modules/categories/entities/category.entity';
import { SlideRole } from '../modules/slides/entities/slide.entity';
// import { BookingStatus } from '../modules/bookings/entities/booking.entity';
import { UserRole } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

enum BookingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class SeedData1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert users
    const users = [
      {
        id: '123e4567-e89b-12d3-a456-426614174030',
        name: 'Nguyễn Văn A',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.STAFF,
        avatar: 'https://example.com/avatar1.jpg',
        isActive: true
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174031',
        name: 'Trần Thị B',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.STAFF,
        avatar: 'https://example.com/avatar2.jpg',
        isActive: true
      }
    ];

    for (const user of users) {
      await queryRunner.query(`
        INSERT INTO "users" ("id", "name", "email", "password", "role", "avatar", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [user.id, user.name, user.email, user.password, user.role, user.avatar, user.isActive]);
    }

    // Insert categories
    const categories = [
      {
        id: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
        name: 'Massage ấn huyệt tại nhà 123',
        description: '',
        type: CategoryType.SERVICE,
        coverImage: '',
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
            language: 'vi',
            name: 'Massage ấn huyệt tại nhà 123',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174101',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
            language: 'en',
            name: 'Home Acupressure Massage 123',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174102',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
            language: 'ko',
            name: '홈 지압 마사지 123',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174103',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
            language: 'zh',
            name: '家庭穴位按摩 123',
            description: ''
          }
        ]
      },
      {
        id: '88f53d2e-4a89-4060-bd65-594b55dfec29',
        name: 'Nối mi tại nhà',
        description: 'ok',
        type: CategoryType.SERVICE,
        coverImage: 'https://pub-34011f56e2b14b9397595639867df8ae.r2.dev/uploads/screenshot-2025-06-02-at-15-19-24-1748959060459.png',
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
            language: 'vi',
            name: 'Nối mi tại nhà',
            description: 'ok'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174104',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
            language: 'en',
            name: 'Home Eyelash Extension',
            description: 'ok'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174105',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
            language: 'ko',
            name: '홈 속눈썹 연장',
            description: 'ok'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174106',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
            language: 'zh',
            name: '家庭睫毛嫁接',
            description: 'ok'
          }
        ]
      },
      {
        id: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        name: 'Nail tại nhà',
        description: '',
        type: CategoryType.SERVICE,
        coverImage: 'https://pub-34011f56e2b14b9397595639867df8ae.r2.dev/uploads/screenshot-2025-06-02-at-17-06-08-1748943791863.png',
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
            language: 'vi',
            name: 'Nail tại nhà',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174107',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
            language: 'en',
            name: 'Home Nail Service',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174108',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
            language: 'ko',
            name: '홈 네일 서비스',
            description: ''
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174109',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
            language: 'zh',
            name: '家庭美甲服务',
            description: ''
          }
        ]
      }
    ];

    for (const category of categories) {
      await queryRunner.query(`
        INSERT INTO "categories" ("id", "type", "coverImage", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [category.id, category.type, category.coverImage]);

      for (const translation of category.translations) {
        await queryRunner.query(`
          INSERT INTO "category_translations" ("id", "categoryId", "language", "name", "description", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [translation.id, translation.categoryId, translation.language, translation.name, translation.description]);
      }
    }

    // Insert services
    const services = [
      {
        id: '0a2a7420-ea00-4843-8235-abed47fc839c',
        name: 'Massage Thái',
        description: null,
        duration: 30,
        price: 0,
        discount: 0,
        coverImage: null,
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174011',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839c',
            language: 'vi',
            name: 'Massage Thái',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174111',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839c',
            language: 'en',
            name: 'Thai Massage',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174112',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839c',
            language: 'ko',
            name: '태국 마사지',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174113',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839c',
            language: 'zh',
            name: '泰式按摩',
            description: null
          }
        ]
      },
      {
        id: '184cb41a-9d1a-4f67-98e9-1c703e54ef58',
        name: 'Nối mi volume',
        description: null,
        duration: 20,
        price: 0,
        discount: 0,
        coverImage: null,
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174012',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef58',
            language: 'vi',
            name: 'Nối mi volume',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174114',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef58',
            language: 'en',
            name: 'Volume Eyelash Extension',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174115',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef58',
            language: 'ko',
            name: '볼륨 속눈썹 연장',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174116',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef58',
            language: 'zh',
            name: '浓密型睫毛嫁接',
            description: null
          }
        ]
      },
      {
        id: '481ce1e0-7c00-4373-a02f-6696dd299377',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        duration: 30,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174013',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299377',
            language: 'vi',
            name: 'Chăm sóc móng',
            description: 'Cơ bản/Chuyên nghiệp - An toàn'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174117',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299377',
            language: 'en',
            name: 'Nail Care',
            description: 'Basic/Professional - Safe'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174118',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299377',
            language: 'ko',
            name: '네일 케어',
            description: '기본/전문 - 안전'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174119',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299377',
            language: 'zh',
            name: '美甲护理',
            description: '基础/专业 - 安全'
          }
        ]
      },
      {
        id: '4a232d17-ccd5-4170-a365-785d5c720504',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        duration: 15,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174014',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720504',
            language: 'vi',
            name: 'Design',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174120',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720504',
            language: 'en',
            name: 'Design',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174121',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720504',
            language: 'ko',
            name: '디자인',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174122',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720504',
            language: 'zh',
            name: '设计',
            description: null
          }
        ]
      },
      {
        id: '4d8cd7bf-2b20-426b-b915-2cd4bca03d94',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        duration: 20,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174015',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d94',
            language: 'vi',
            name: 'Vẽ móng',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174123',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d94',
            language: 'en',
            name: 'Nail Art',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174124',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d94',
            language: 'ko',
            name: '네일 아트',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174125',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d94',
            language: 'zh',
            name: '美甲彩绘',
            description: null
          }
        ]
      },
      {
        id: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13ba',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        duration: 10,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174016',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13ba',
            language: 'vi',
            name: 'Đắp gel',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174126',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13ba',
            language: 'en',
            name: 'Gel Application',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174127',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13ba',
            language: 'ko',
            name: '젤 적용',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174128',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13ba',
            language: 'zh',
            name: '凝胶美甲',
            description: null
          }
        ]
      },
      {
        id: 'f30445fb-16bc-4b43-b716-963f6cd549fa',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bed',
        duration: 10,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174017',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fa',
            language: 'vi',
            name: 'Đắp bột',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174129',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fa',
            language: 'en',
            name: 'Powder Application',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174130',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fa',
            language: 'ko',
            name: '파우더 적용',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174131',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fa',
            language: 'zh',
            name: '粉末美甲',
            description: null
          }
        ]
      },
      {
        id: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b7',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
        duration: 20,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174018',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b7',
            language: 'vi',
            name: 'Nối mi classic',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174132',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b7',
            language: 'en',
            name: 'Classic Eyelash Extension',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174133',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b7',
            language: 'ko',
            name: '클래식 속눈썹 연장',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174134',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b7',
            language: 'zh',
            name: '经典睫毛嫁接',
            description: null
          }
        ]
      },
      {
        id: 'e19a31bc-e30b-4767-9b3f-c10010bcf4eb',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
        duration: 30,
        price: 0,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174019',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4eb',
            language: 'vi',
            name: 'Nối mi thiên thần',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174135',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4eb',
            language: 'en',
            name: 'Angel Eyelash Extension',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174136',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4eb',
            language: 'ko',
            name: '엔젤 속눈썹 연장',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174137',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4eb',
            language: 'zh',
            name: '天使睫毛嫁接',
            description: null
          }
        ]
      },
      {
        id: '78a934c3-81c9-4c3a-852a-a9d4d314db76',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec29',
        duration: 30,
        price: 123,
        discount: 0,
        coverImage: null,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174020',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db76',
            language: 'vi',
            name: 'Nối mi lông thỏ',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174138',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db76',
            language: 'en',
            name: 'Rabbit Fur Eyelash Extension',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174139',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db76',
            language: 'ko',
            name: '토끼 털 속눈썹 연장',
            description: null
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174140',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db76',
            language: 'zh',
            name: '兔毛睫毛嫁接',
            description: null
          }
        ]
      }
    ];

    for (const service of services) {
      await queryRunner.query(`
        INSERT INTO "services" ("id", "duration", "price", "discount", "coverImage", "categoryId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [service.id, service.duration, service.price, service.discount, service.coverImage, service.categoryId]);

      for (const translation of service.translations) {
        await queryRunner.query(`
          INSERT INTO "service_translations" ("id", "serviceId", "language", "name", "description", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [translation.id, service.id, translation.language, translation.name, translation.description]);
      }
    }

    // Insert blogs
    const blogs = [
      {
        id: '123e4567-e89b-12d3-a456-426614174044',
        title: 'Lợi ích của massage',
        description: 'Massage giúp giảm stress và đau nhức cơ thể',
        content: 'Massage mang lại nhiều lợi ích cho sức khỏe như giảm stress, đau nhức cơ thể và cải thiện tuần hoàn máu.',
        slug: 'loi-ich-cua-massage',
        coverImage: 'https://example.com/blog1.jpg',
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
        viewCount: 0,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174045',
            blogId: '123e4567-e89b-12d3-a456-426614174044',
            language: 'vi',
            title: 'Lợi ích của massage',
            description: 'Massage giúp giảm stress và đau nhức cơ thể',
            content: 'Massage mang lại nhiều lợi ích cho sức khỏe như giảm stress, đau nhức cơ thể và cải thiện tuần hoàn máu.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174046',
            blogId: '123e4567-e89b-12d3-a456-426614174044',
            language: 'en',
            title: 'Benefits of Massage',
            description: 'Massage helps reduce stress and body pain',
            content: 'Massage brings many health benefits such as reducing stress, body pain and improving blood circulation.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174141',
            blogId: '123e4567-e89b-12d3-a456-426614174044',
            language: 'ko',
            title: '마사지의 이점',
            description: '마사지는 스트레스와 신체 통증을 줄이는 데 도움이 됩니다',
            content: '마사지는 스트레스 감소, 신체 통증 완화 및 혈액 순환 개선과 같은 많은 건강상의 이점을 제공합니다.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174142',
            blogId: '123e4567-e89b-12d3-a456-426614174044',
            language: 'zh',
            title: '按摩的好处',
            description: '按摩有助于减轻压力和身体疼痛',
            content: '按摩带来许多健康益处，如减轻压力、缓解身体疼痛和改善血液循环。'
          }
        ]
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174047',
        title: 'Các loại massage phổ biến',
        description: 'Tìm hiểu về các loại massage phổ biến hiện nay',
        content: 'Có nhiều loại massage phổ biến như massage Thái, massage đá nóng, massage thể thao và massage thư giãn.',
        slug: 'cac-loai-massage-pho-bien',
        coverImage: 'https://example.com/blog2.jpg',
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81ae',
        viewCount: 0,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174048',
            blogId: '123e4567-e89b-12d3-a456-426614174047',
            language: 'vi',
            title: 'Các loại massage phổ biến',
            description: 'Tìm hiểu về các loại massage phổ biến hiện nay',
            content: 'Có nhiều loại massage phổ biến như massage Thái, massage đá nóng, massage thể thao và massage thư giãn.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174049',
            blogId: '123e4567-e89b-12d3-a456-426614174047',
            language: 'en',
            title: 'Popular Types of Massage',
            description: 'Learn about popular types of massage today',
            content: 'There are many popular types of massage such as Thai massage, hot stone massage, sports massage and relaxation massage.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174143',
            blogId: '123e4567-e89b-12d3-a456-426614174047',
            language: 'ko',
            title: '인기 있는 마사지 유형',
            description: '오늘날 인기 있는 마사지 유형에 대해 알아보세요',
            content: '태국 마사지, 핫 스톤 마사지, 스포츠 마사지 및 릴랙스 마사지와 같은 많은 인기 있는 마사지 유형이 있습니다.'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174144',
            blogId: '123e4567-e89b-12d3-a456-426614174047',
            language: 'zh',
            title: '流行的按摩类型',
            description: '了解当今流行的按摩类型',
            content: '有许多流行的按摩类型，如泰式按摩、热石按摩、运动按摩和放松按摩。'
          }
        ]
      }
    ];

    for (const blog of blogs) {
      await queryRunner.query(`
        INSERT INTO "blogs" ("id", "title", "description", "content", "slug", "coverImage", "categoryId", "viewCount", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `, [blog.id, blog.title, blog.description, blog.content, blog.slug, blog.coverImage, blog.categoryId, blog.viewCount]);

      for (const translation of blog.translations) {
        await queryRunner.query(`
          INSERT INTO "blog_translations" ("id", "blogId", "language", "title", "description", "content", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [translation.id, blog.id, translation.language, translation.title, translation.description, translation.content]);
      }
    }

    // Insert slides
    const slides = [
      {
        id: '123e4567-e89b-12d3-a456-426614174020',
        image: 'https://example.com/slide1.jpg',
        role: SlideRole.HOME,
        order: 1,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174021',
            slideId: '123e4567-e89b-12d3-a456-426614174020',
            language: 'vi',
            title: 'Chào mừng đến với Massage Home 24h',
            description: 'Dịch vụ massage chuyên nghiệp 24/7'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174022',
            slideId: '123e4567-e89b-12d3-a456-426614174020',
            language: 'en',
            title: 'Welcome to Massage Home 24h',
            description: 'Professional massage services 24/7'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174023',
            slideId: '123e4567-e89b-12d3-a456-426614174020',
            language: 'ko',
            title: '마사지 홈 24h에 오신 것을 환영합니다',
            description: '24/7 전문 마사지 서비스'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174024',
            slideId: '123e4567-e89b-12d3-a456-426614174020',
            language: 'zh',
            title: '欢迎来到24小时按摩之家',
            description: '24/7专业按摩服务'
          }
        ]
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174025',
        image: 'https://example.com/slide2.jpg',
        role: SlideRole.HOME,
        order: 2,
        translations: [
          {
            id: '123e4567-e89b-12d3-a456-426614174026',
            slideId: '123e4567-e89b-12d3-a456-426614174025',
            language: 'vi',
            title: 'Massage Thái Truyền Thống',
            description: 'Trải nghiệm massage Thái đích thực'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174027',
            slideId: '123e4567-e89b-12d3-a456-426614174025',
            language: 'en',
            title: 'Traditional Thai Massage',
            description: 'Experience authentic Thai massage'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174028',
            slideId: '123e4567-e89b-12d3-a456-426614174025',
            language: 'ko',
            title: '전통 태국 마사지',
            description: '진정한 태국 마사지 경험'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174029',
            slideId: '123e4567-e89b-12d3-a456-426614174025',
            language: 'zh',
            title: '传统泰式按摩',
            description: '体验正宗泰式按摩'
          }
        ]
      }
    ];

    for (const slide of slides) {
      await queryRunner.query(`
        INSERT INTO "slides" ("id", "image", "role", "order", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [slide.id, slide.image, slide.role, slide.order]);

      for (const translation of slide.translations) {
        await queryRunner.query(`
          INSERT INTO "slide_translations" ("id", "slideId", "language", "title", "description", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [translation.id, slide.id, translation.language, translation.title, translation.description]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "slide_translations"`);
    await queryRunner.query(`DELETE FROM "slides"`);
    await queryRunner.query(`DELETE FROM "blog_translations"`);
    await queryRunner.query(`DELETE FROM "blogs"`);
    await queryRunner.query(`DELETE FROM "service_translations"`);
    await queryRunner.query(`DELETE FROM "services"`);
    await queryRunner.query(`DELETE FROM "category_translations"`);
    await queryRunner.query(`DELETE FROM "categories"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}