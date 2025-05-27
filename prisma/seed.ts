import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.settingsTranslation.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.reviewTranslation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.serviceTranslation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.postTranslation.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Tạo mật khẩu mới với bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('phudk123', salt);
  console.log('Hash mật khẩu:', hashedPassword);
  
  // Tạo admin user
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@test.com',
      password: hashedPassword, // Mật khẩu: phudk123
      role: 'admin',
      isActive: true
    }
  });

  // Tạo mật khẩu cho manager
  const managerPassword = await bcrypt.hash('phudk123', salt);
  
  // Tạo tài khoản manager
  await prisma.user.create({
    data: {
      name: 'Manager',
      email: 'manager@sparenew.com',
      password: managerPassword, // Mật khẩu: phudk123
      role: 'manager',
      isActive: true
    }
  });
  
  console.log('Created users with the following credentials:');
  console.log('- Admin: admin@test.com / phudk123');
  console.log('- Manager: manager@sparenew.com / phudk123');

  // Create categories
  console.log('\nSeeding categories...');
  
  const categories = [
    {
      name: 'Tin tức',
      description: 'Các bài viết cập nhật tin tức mới nhất về spa và làm đẹp'
    },
    {
      name: 'Khuyến mãi',
      description: 'Thông tin về các chương trình khuyến mãi và ưu đãi đặc biệt'
    },
    {
      name: 'Hướng dẫn',
      description: 'Các bài viết hướng dẫn và chia sẻ kinh nghiệm về chăm sóc sắc đẹp'
    },
    {
      name: 'Sự kiện',
      description: 'Thông tin về các sự kiện, workshop và hoạt động của spa'
    }
  ];
  
  for (const category of categories) {
    // Tạo slug từ tên
    const slug = slugify(category.name, { lower: true });
    
    try {
      await prisma.category.create({
        data: {
          name: category.name,
          slug,
          description: category.description
        }
      });
      console.log(`Created category: ${category.name}`);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: 'Body Massage',
      slug: 'body-massage',
      description: 'Full body massage with professional techniques to relax and rejuvenate.',
      price: 55.00,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isActive: true
    }
  });

  // Create service translations
  await prisma.serviceTranslation.createMany({
    data: [
      {
        serviceId: service1.id,
        language: 'vi',
        name: 'Massage Toàn Thân',
        description: 'Massage toàn thân với các kỹ thuật chuyên nghiệp để thư giãn và trẻ hóa.'
      },
      {
        serviceId: service1.id,
        language: 'zh',
        name: '全身按摩',
        description: '使用专业技术进行全身按摩，以放松和恢复活力。'
      },
      {
        serviceId: service1.id,
        language: 'ko',
        name: '전신 마사지',
        description: '휴식과 활력을 위한 전문적인 기술을 사용한 전신 마사지.'
      },
      {
        serviceId: service1.id,
        language: 'ru',
        name: 'Массаж тела',
        description: 'Массаж всего тела с профессиональными техниками для расслабления и омоложения.'
      }
    ]
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Foot Reflexology',
      slug: 'foot-reflexology',
      description: 'Pressure applied to specific points on the feet to promote wellness.',
      price: 40.00,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isActive: true
    }
  });

  await prisma.serviceTranslation.createMany({
    data: [
      {
        serviceId: service2.id,
        language: 'vi',
        name: 'Bấm Huyệt Chân',
        description: 'Áp lực vào các điểm cụ thể trên bàn chân để thúc đẩy sức khỏe tổng thể.'
      },
      {
        serviceId: service2.id,
        language: 'zh',
        name: '足部反射疗法',
        description: '对脚部特定穴位施加压力以促进健康。'
      },
      {
        serviceId: service2.id,
        language: 'ko',
        name: '발 반사 요법',
        description: '전반적인 건강 증진을 위해 발의 특정 부위에 압력을 가합니다.'
      },
      {
        serviceId: service2.id,
        language: 'ru',
        name: 'Рефлексология стоп',
        description: 'Давление, применяемое к определенным точкам на ступнях для улучшения здоровья.'
      }
    ]
  });

  // Create blog posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Benefits of Regular Massage',
      slug: 'benefits-of-regular-massage',
      content: 'Regular massage therapy has numerous benefits including stress reduction, improved circulation, and pain relief. Many people find that regular massage sessions help them maintain better physical and mental health.',
      excerpt: 'Discover how regular massage therapy can improve your overall wellbeing.',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      isPublished: true,
      author: 'Sarah Johnson',
      publishedAt: new Date(),
      categoryId: 1 // Liên kết với danh mục 'Tin tức'
    }
  });

  await prisma.postTranslation.createMany({
    data: [
      {
        postId: post1.id,
        language: 'vi',
        title: 'Lợi ích của việc Massage thường xuyên',
        content: 'Liệu pháp massage thường xuyên có nhiều lợi ích bao gồm giảm căng thẳng, cải thiện tuần hoàn và giảm đau. Nhiều người nhận thấy rằng các buổi massage thường xuyên giúp họ duy trì sức khỏe thể chất và tinh thần tốt hơn.',
        excerpt: 'Khám phá cách liệu pháp massage thường xuyên có thể cải thiện sức khỏe tổng thể của bạn.'
      },
      {
        postId: post1.id,
        language: 'zh',
        title: '定期按摩的好处',
        content: '定期按摩疗法有许多好处，包括减轻压力、改善血液循环和缓解疼痛。许多人发现，定期按摩可以帮助他们保持更好的身心健康。',
        excerpt: '了解定期按摩疗法如何改善您的整体健康。'
      },
      {
        postId: post1.id,
        language: 'ko',
        title: '정기적인 마사지의 이점',
        content: '정기적인 마사지 요법은 스트레스 감소, 혈액 순환 개선, 통증 완화 등 다양한 이점이 있습니다. 많은 사람들이 정기적인 마사지 세션이 더 나은 신체적, 정신적 건강을 유지하는 데 도움이 된다는 것을 발견합니다.',
        excerpt: '정기적인 마사지 요법이 어떻게 전반적인 웰빙을 향상시킬 수 있는지 알아보세요.'
      },
      {
        postId: post1.id,
        language: 'ru',
        title: 'Преимущества регулярного массажа',
        content: 'Регулярная массажная терапия имеет множество преимуществ, включая снижение стресса, улучшение кровообращения и облегчение боли. Многие люди обнаруживают, что регулярные сеансы массажа помогают им поддерживать лучшее физическое и психическое здоровье.',
        excerpt: 'Узнайте, как регулярная массажная терапия может улучшить ваше общее самочувствие.'
      }
    ]
  });

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      name: 'Michael Chang',
      rating: 5,
      comment: 'Best foot massage in my life. If your feet are tired, don\'t miss this place. Incredible. Super friendly staff and very sweet massage therapist.',
      isActive: true
    }
  });

  await prisma.reviewTranslation.createMany({
    data: [
      {
        reviewId: review1.id,
        language: 'vi',
        comment: 'Massage chân tốt nhất trong đời tôi. Nếu chân bạn mệt mỏi, đừng bỏ lỡ nơi này. Thật không thể tin được. Nhân viên cực kỳ thân thiện và nhà trị liệu massage rất dễ thương.'
      },
      {
        reviewId: review1.id,
        language: 'zh',
        comment: '我一生中最好的足部按摩。如果你的脚很累，不要错过这个地方。令人难以置信。工作人员非常友好，按摩师非常贴心。'
      },
      {
        reviewId: review1.id,
        language: 'ko',
        comment: '내 인생 최고의 발 마사지. 발이 피곤하다면 이곳을 놓치지 마세요. 믿을 수 없습니다. 매우 친절한 직원과 매우 상냥한 마사지 치료사.'
      },
      {
        reviewId: review1.id,
        language: 'ru',
        comment: 'Лучший массаж ног в моей жизни. Если ваши ноги устали, не пропустите это место. Невероятно. Очень дружелюбный персонал и очень милый массажист.'
      }
    ]
  });

  // Create site settings
  const settings1 = await prisma.siteSettings.create({
    data: {
      key: 'contact_phone',
      value: '+84 123 456 789'
    }
  });

  const settings2 = await prisma.siteSettings.create({
    data: {
      key: 'contact_email',
      value: 'info@sparenew.com'
    }
  });

  const settings3 = await prisma.siteSettings.create({
    data: {
      key: 'contact_address',
      value: '123 Spa Street, District 1, Ho Chi Minh City, Vietnam'
    }
  });

  await prisma.settingsTranslation.createMany({
    data: [
      {
        settingId: settings3.id,
        language: 'vi',
        value: '123 Đường Spa, Quận 1, Thành phố Hồ Chí Minh, Việt Nam'
      },
      {
        settingId: settings3.id,
        language: 'zh',
        value: '越南胡志明市第一郡SPA街123号'
      },
      {
        settingId: settings3.id,
        language: 'ko',
        value: '베트남 호치민시 1군 스파 거리 123번지'
      },
      {
        settingId: settings3.id,
        language: 'ru',
        value: '123 улица Спа, Район 1, Хошимин, Вьетнам'
      }
    ]
  });

console.log('Seed data created successfully');
}

main()
  .then(async () => {
    console.log('\nDatabase seeding completed successfully!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during database seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
