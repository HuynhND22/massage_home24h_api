import { MigrationInterface, QueryRunner } from 'typeorm';
import { CategoryType } from '../modules/categories/entities/category.entity';
import * as bcrypt from 'bcrypt';
import { SlideRole } from '../modules/slides/entities/slide.entity';

export class SeedServiceData1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert categories
    const categories = [
      {
        id: '00645b2e-20f1-4532-8301-83cd7a9e81af',
        name: 'Massage',
        description: 'Dịch vụ massage chuyên nghiệp tại nhà',
        type: CategoryType.SERVICE,
        coverImage: 'https://example.com/massage-category.jpg',
        translations: [
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
            language: 'vi',
            name: 'Massage',
            description: 'Dịch vụ massage chuyên nghiệp tại nhà'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174101',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
            language: 'en',
            name: 'Massage',
            description: 'Professional home massage services'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174102',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
            language: 'ko',
            name: '마사지',
            description: '전문 홈 마사지 서비스'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174103',
            categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
            language: 'zh',
            name: '按摩',
            description: '专业家庭按摩服务'
          }
        ]
      },
      {
        id: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        name: 'Nối mi',
        description: 'Dịch vụ nối mi chuyên nghiệp',
        type: CategoryType.SERVICE,
        coverImage: 'https://example.com/eyelash-category.jpg',
        translations: [
          {
            id: '223e4567-e89b-12d3-a456-426614174002',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
            language: 'vi',
            name: 'Nối mi',
            description: 'Dịch vụ nối mi chuyên nghiệp'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174104',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
            language: 'en',
            name: 'Eyelash Extension',
            description: 'Professional eyelash extension services'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174105',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
            language: 'ko',
            name: '속눈썹 연장',
            description: '전문 속눈썹 연장 서비스'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174106',
            categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
            language: 'zh',
            name: '睫毛嫁接',
            description: '专业睫毛嫁接服务'
          }
        ]
      },
      {
        id: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
        name: 'Nails',
        description: 'Dịch vụ làm nail chuyên nghiệp',
        type: CategoryType.SERVICE,
        coverImage: 'https://example.com/nail-category.jpg',
        translations: [
          {
            id: '223e4567-e89b-12d3-a456-426614174003',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
            language: 'vi',
            name: 'Nails',
            description: 'Dịch vụ làm nail chuyên nghiệp'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174107',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
            language: 'en',
            name: 'Nails',
            description: 'Professional nail services'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174108',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
            language: 'ko',
            name: '네일',
            description: '전문 네일 서비스'
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174109',
            categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
            language: 'zh',
            name: '美甲',
            description: '专业美甲服务'
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
      // Massage services
      {
        id: '0a2a7420-ea00-4843-8235-abed47fc839d',
        name: 'Massage với tinh dầu',
        description: 'Dịch vụ massage sử dụng tinh dầu thiên nhiên cao cấp',
        duration: 60,
        price: 300000,
        discount: 0,
        coverImage: 'https://example.com/oil-massage.jpg',
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174011',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839d',
            language: 'vi',
            name: 'Massage với tinh dầu',
            description: 'Dịch vụ massage sử dụng tinh dầu thiên nhiên cao cấp, mang đến cho bạn trải nghiệm thư giãn sâu và phục hồi năng lượng tinh thần. Mỗi động tác xoa bóp nhẹ nhàng kết hợp với mùi hương dịu êm giúp giải tỏa áp lực, giảm đau mỏi và cải thiện giấc ngủ. Thích hợp cho những ai đang mệt mỏi, căng thẳng hoặc muốn thưởng cho bản thân một liệu trình chăm sóc toàn diện.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174111',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839d',
            language: 'en',
            name: 'Aromatherapy Massage',
            description: 'Massage service using premium natural essential oils, offering you a deep relaxation experience and mental energy recovery. Each gentle massage stroke combined with soothing aromas helps relieve stress, reduce pain and fatigue, and improve sleep quality. Ideal for those who are tired, stressed, or want to reward themselves with a comprehensive care treatment.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174112',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839d',
            language: 'ko',
            name: '아로마 테라피 마사지',
            description: '고급 천연 에센셜 오일을 사용한 마사지 서비스로 깊은 휴식 경험과 정신적 에너지 회복을 제공합니다. 각각의 부드러운 마사지 동작은 진정하는 향기와 결합되어 스트레스 해소, 통증 및 피로 감소, 수면 질 개선에 도움을 줍니다. 피로하거나 스트레스를 받는 분들, 또는 자신에게 포괄적인 케어 트리트먼트를 선물하고 싶은 분들에게 이상적입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174113',
            serviceId: '0a2a7420-ea00-4843-8235-abed47fc839d',
            language: 'zh',
            name: '芳香精油按摩',
            description: '使用优质天然精油的按摩服务，为您提供深度放松体验和精神能量恢复。每个轻柔的按摩动作结合舒缓的香气，有助于缓解压力、减轻疼痛和疲劳，并改善睡眠质量。适合那些感到疲倦、压力大或想给自己一个全面护理疗程的人。'
          }
        ]
      },
      {
        id: '184cb41a-9d1a-4f67-98e9-1c703e54ef59',
        name: 'Massage Thái cổ truyền',
        description: 'Một liệu pháp cổ truyền hàng trăm năm từ Thái Lan',
        duration: 90,
        price: 400000,
        discount: 0,
        coverImage: 'https://example.com/thai-massage.jpg',
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174012',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef59',
            language: 'vi',
            name: 'Massage Thái cổ truyền',
            description: 'Một liệu pháp cổ truyền hàng trăm năm từ Thái Lan, sử dụng kỹ thuật kéo giãn, bấm huyệt và điều chỉnh tư thế giúp cơ thể thả lỏng hoàn toàn. Massage Thái không sử dụng dầu, tập trung vào sự vận động linh hoạt của các nhóm cơ, giúp lưu thông khí huyết, giải phóng năng lượng bị ứ tắc và mang lại cảm giác sảng khoái tức thì. Kéo giãn sâu & bấm huyệt chuẩn Thái'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174114',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef59',
            language: 'en',
            name: 'Traditional Thai Massage',
            description: 'A centuries-old traditional therapy from Thailand, using stretching techniques, acupressure and posture adjustment to help the body completely relax. Thai massage does not use oil, focusing on the flexible movement of muscle groups, helping to circulate blood, release blocked energy and bring immediate refreshment. Deep stretching & authentic Thai acupressure'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174115',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef59',
            language: 'ko',
            name: '전통 태국 마사지',
            description: '태국에서 수백 년 동안 전해져 내려온 전통 치료법으로, 스트레칭 기술, 지압 및 자세 조정을 사용하여 몸이 완전히 이완되도록 돕습니다. 태국 마사지는 오일을 사용하지 않으며 근육 그룹의 유연한 움직임에 중점을 두어 혈액 순환을 돕고 막힌 에너지를 방출하며 즉각적인 상쾌함을 가져다줍니다. 깊은 스트레칭 & 진정한 태국 지압'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174116',
            serviceId: '184cb41a-9d1a-4f67-98e9-1c703e54ef59',
            language: 'zh',
            name: '传统泰式按摩',
            description: '来自泰国的百年传统疗法，使用拉伸技术、穴位按压和姿势调整帮助身体完全放松。泰式按摩不使用油，专注于肌肉群的灵活运动，有助于血液循环，释放阻塞的能量并带来即时的清爽感。深度拉伸 & 正宗泰式穴位按压'
          }
        ]
      },
      {
        id: '481ce1e0-7c00-4373-a02f-6696dd299378',
        name: 'Massage chân tốt nhất',
        description: 'Đôi chân là nơi tích tụ nhiều căng thẳng và áp lực',
        duration: 45,
        price: 250000,
        discount: 0,
        coverImage: 'https://example.com/foot-massage.jpg',
        categoryId: '00645b2e-20f1-4532-8301-83cd7a9e81af',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174013',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299378',
            language: 'vi',
            name: 'Massage chân tốt nhất',
            description: 'Đôi chân là nơi tích tụ nhiều căng thẳng và áp lực sau một ngày dài vận động. Massage chân không chỉ giúp giảm đau, thư giãn mà còn kích thích các huyệt đạo liên kết với toàn cơ thể. Với kỹ thuật day ấn chuyên sâu từ bàn chân đến bắp chân, dịch vụ này giúp cải thiện lưu thông máu, giảm sưng mỏi và mang lại cảm giác nhẹ nhàng, dễ chịu đến toàn thân.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174117',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299378',
            language: 'en',
            name: 'Premium Foot Massage',
            description: 'Feet accumulate a lot of tension and pressure after a long day of activity. Foot massage not only helps relieve pain and relax but also stimulates acupoints connected to the whole body. With professional pressing techniques from the feet to the calves, this service helps improve blood circulation, reduce swelling and fatigue, and bring a gentle, pleasant feeling to the whole body.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174118',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299378',
            language: 'ko',
            name: '프리미엄 발 마사지',
            description: '발은 긴 하루의 활동 후 많은 긴장과 압력이 쌓이는 곳입니다. 발 마사지는 통증 완화와 휴식에 도움을 줄 뿐만 아니라 전신과 연결된 경혈을 자극합니다. 발에서 종아리까지 전문적인 압박 기술로 혈액 순환을 개선하고 부종과 피로를 줄이며 전신에 부드럽고 즐거운 느낌을 선사합니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174119',
            serviceId: '481ce1e0-7c00-4373-a02f-6696dd299378',
            language: 'zh',
            name: '顶级足部按摩',
            description: '经过一天长时间的活动，脚部会积累很多紧张和压力。足部按摩不仅有助于缓解疼痛和放松，还能刺激与全身相连的穴位。通过从脚到小腿的专业按压技术，这项服务有助于改善血液循环，减少肿胀和疲劳，并为全身带来轻柔、愉悦的感觉。'
          }
        ]
      },
      // Eyelash services
      {
        id: '4a232d17-ccd5-4170-a365-785d5c720505',
        name: 'Nối mi Classic',
        description: 'Tự nhiên nhẹ nhàng',
        duration: 90,
        price: 500000,
        discount: 0,
        coverImage: 'https://example.com/classic-eyelash.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174014',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720505',
            language: 'vi',
            name: 'Nối mi Classic',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản, sử dụng sản phẩm cao cấp, đảm bảo an toàn tuyệt đối cho mắt, độ bền lâu, và phù hợp với từng kiểu mắt - phong cách cá nhân. Phù hợp cho khách hàng thích phong cách tinh tế, nhẹ nhàng và tự nhiên. Tăng độ dày và sâu cho hàng mi - hiệu ứng nổi bật, thu hút. Kỹ thuật đặc biệt cho vẻ đẹp sắc sảo, quyến rũ - không nặng mí. Cân bằng giữa tự nhiên và nổi bật - phù hợp nhiều dáng mắt. Tư vấn kiểu nối phù hợp với sự kiện, concept makeup, dáng mắt riêng biệt. Dịch vụ an toàn cho những ai đã nối mi trước đó hoặc cần làm mới hoàn toàn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174120',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720505',
            language: 'en',
            name: 'Classic Eyelash Extension',
            description: 'Our team of highly skilled technicians, professionally trained, uses premium products to ensure absolute safety for the eyes, long-lasting durability, and suitability for each eye shape and personal style. Ideal for customers who prefer subtle, gentle and natural styles. Increases the thickness and depth of lashes - creating a standout, attractive effect. Special techniques for sharp, attractive beauty - without heavy eyelids. Balances between natural and prominent - suitable for many eye shapes. Consultation on suitable extension styles for events, makeup concepts, and unique eye shapes. Safe service for those who have had previous extensions or need a complete refresh.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174121',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720505',
            language: 'ko',
            name: '클래식 속눈썹 연장',
            description: '고도로 숙련된 기술자 팀은 전문적으로 훈련되어 고품질 제품을 사용하여 눈에 대한 절대적인 안전성, 오래 지속되는 내구성 및 각 눈 모양과 개인 스타일에 적합성을 보장합니다. 섬세하고 부드럽고 자연스러운 스타일을 선호하는 고객에게 이상적입니다. 속눈썹의 두께와 깊이를 증가시켜 눈에 띄고 매력적인 효과를 창출합니다. 날카롭고 매력적인 아름다움을 위한 특별한 기술 - 무거운 눈꺼풀 없이. 자연스러움과 두드러짐 사이의 균형 - 다양한 눈 모양에 적합합니다. 이벤트, 메이크업 컨셉 및 독특한 눈 모양에 적합한 연장 스타일에 대한 상담. 이전에 연장을 했거나 완전히 새로고침이 필요한 분들을 위한 안전한 서비스입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174122',
            serviceId: '4a232d17-ccd5-4170-a365-785d5c720505',
            language: 'zh',
            name: '经典睫毛嫁接',
            description: '我们团队由技术娴熟、经过专业培训的技术人员组成，使用优质产品，确保对眼睛的绝对安全、持久耐用，并适合每种眼型和个人风格。适合喜欢精致、柔和和自然风格的顾客。增加睫毛的厚度和深度 - 创造突出、吸引人的效果。特殊技术打造锐利、迷人的美感 - 不会让眼皮沉重。在自然和突出之间取得平衡 - 适合多种眼型。根据活动、化妆概念和独特眼型提供合适的嫁接风格咨询。为之前做过嫁接或需要完全刷新的顾客提供安全服务。'
          }
        ]
      },
      {
        id: '4d8cd7bf-2b20-426b-b915-2cd4bca03d95',
        name: 'Nối mi Volume - mi fan 3D-6D',
        description: 'Đội ngũ kỹ thuật viên tay nghề cao',
        duration: 120,
        price: 800000,
        discount: 0,
        coverImage: 'https://example.com/volume-eyelash.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174015',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d95',
            language: 'vi',
            name: 'Nối mi Volume - mi fan 3D-6D',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản, sử dụng sản phẩm cao cấp, đảm bảo an toàn tuyệt đối cho mắt, độ bền lâu, và phù hợp với từng kiểu mắt - phong cách cá nhân. Phù hợp cho khách hàng thích phong cách tinh tế, nhẹ nhàng và tự nhiên. Tăng độ dày và sâu cho hàng mi - hiệu ứng nổi bật, thu hút. Kỹ thuật đặc biệt cho vẻ đẹp sắc sảo, quyến rũ - không nặng mí. Cân bằng giữa tự nhiên và nổi bật - phù hợp nhiều dáng mắt. Tư vấn kiểu nối phù hợp với sự kiện, concept makeup, dáng mắt riêng biệt. Dịch vụ an toàn cho những ai đã nối mi trước đó hoặc cần làm mới hoàn toàn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174123',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d95',
            language: 'en',
            name: 'Volume Eyelash Extension - 3D-6D fan lashes',
            description: 'Our team of highly skilled technicians, professionally trained, uses premium products to ensure absolute safety for the eyes, long-lasting durability, and suitability for each eye shape and personal style. Ideal for customers who prefer subtle, gentle and natural styles. Creates dramatic volume and depth for lashes - with standout, attractive effect. Special techniques for sharp, attractive beauty - without heavy eyelids. Balances between natural and prominent - suitable for many eye shapes. Consultation on suitable extension styles for events, makeup concepts, and unique eye shapes. Safe service for those who have had previous extensions or need a complete refresh.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174124',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d95',
            language: 'ko',
            name: '볼륨 속눈썹 연장 - 3D-6D 팬 속눈썹',
            description: '고도로 숙련된 기술자 팀은 전문적으로 훈련되어 고품질 제품을 사용하여 눈에 대한 절대적인 안전성, 오래 지속되는 내구성 및 각 눈 모양과 개인 스타일에 적합성을 보장합니다. 섬세하고 부드럽고 자연스러운 스타일을 선호하는 고객에게 이상적입니다. 속눈썹에 극적인 볼륨과 깊이를 창출합니다 - 눈에 띄고 매력적인 효과와 함께. 날카롭고 매력적인 아름다움을 위한 특별한 기술 - 무거운 눈꺼풀 없이. 자연스러움과 두드러짐 사이의 균형 - 다양한 눈 모양에 적합합니다. 이벤트, 메이크업 컨셉 및 독특한 눈 모양에 적합한 연장 스타일에 대한 상담. 이전에 연장을 했거나 완전히 새로고침이 필요한 분들을 위한 안전한 서비스입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174125',
            serviceId: '4d8cd7bf-2b20-426b-b915-2cd4bca03d95',
            language: 'zh',
            name: '浓密型睫毛嫁接 - 3D-6D扇形睫毛',
            description: '我们团队由技术娴熟、经过专业培训的技术人员组成，使用优质产品，确保对眼睛的绝对安全、持久耐用，并适合每种眼型和个人风格。适合喜欢精致、柔和和自然风格的顾客。为睫毛创造戏剧性的浓密和深度 - 具有突出、吸引人的效果。特殊技术打造锐利、迷人的美感 - 不会让眼皮沉重。在自然和突出之间取得平衡 - 适合多种眼型。根据活动、化妆概念和独特眼型提供合适的嫁接风格咨询。为之前做过嫁接或需要完全刷新的顾客提供安全服务。'
          }
        ]
      },
      {
        id: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13bb',
        name: 'Nối mi Katun / mi lụa / mi thỏ',
        description: 'Đội ngũ kỹ thuật viên tay nghề cao',
        duration: 120,
        price: 700000,
        discount: 0,
        coverImage: 'https://example.com/katun-eyelash.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174016',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13bb',
            language: 'vi',
            name: 'Nối mi Katun / mi lụa / mi thỏ',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản, sử dụng sản phẩm cao cấp, đảm bảo an toàn tuyệt đối cho mắt, độ bền lâu, và phù hợp với từng kiểu mắt - phong cách cá nhân. Phù hợp cho khách hàng thích phong cách tinh tế, nhẹ nhàng và tự nhiên. Tăng độ dày và sâu cho hàng mi - hiệu ứng nổi bật, thu hút. Kỹ thuật đặc biệt cho vẻ đẹp sắc sảo, quyến rũ - không nặng mí. Cân bằng giữa tự nhiên và nổi bật - phù hợp nhiều dáng mắt. Tư vấn kiểu nối phù hợp với sự kiện, concept makeup, dáng mắt riêng biệt. Dịch vụ an toàn cho những ai đã nối mi trước đó hoặc cần làm mới hoàn toàn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174126',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13bb',
            language: 'en',
            name: 'Katun / Silk / Rabbit Fur Eyelash Extension',
            description: 'Our team of highly skilled technicians, professionally trained, uses premium products to ensure absolute safety for the eyes, long-lasting durability, and suitability for each eye shape and personal style. Ideal for customers who prefer subtle, gentle and natural styles. Increases the thickness and depth of lashes - creating a standout, attractive effect. Special techniques for sharp, attractive beauty - without heavy eyelids. Balances between natural and prominent - suitable for many eye shapes. Consultation on suitable extension styles for events, makeup concepts, and unique eye shapes. Safe service for those who have had previous extensions or need a complete refresh.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174127',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13bb',
            language: 'ko',
            name: '카툰 / 실크 / 토끼 털 속눈썹 연장',
            description: '고도로 숙련된 기술자 팀은 전문적으로 훈련되어 고품질 제품을 사용하여 눈에 대한 절대적인 안전성, 오래 지속되는 내구성 및 각 눈 모양과 개인 스타일에 적합성을 보장합니다. 섬세하고 부드럽고 자연스러운 스타일을 선호하는 고객에게 이상적입니다. 속눈썹의 두께와 깊이를 증가시켜 눈에 띄고 매력적인 효과를 창출합니다. 날카롭고 매력적인 아름다움을 위한 특별한 기술 - 무거운 눈꺼풀 없이. 자연스러움과 두드러짐 사이의 균형 - 다양한 눈 모양에 적합합니다. 이벤트, 메이크업 컨셉 및 독특한 눈 모양에 적합한 연장 스타일에 대한 상담. 이전에 연장을 했거나 완전히 새로고침이 필요한 분들을 위한 안전한 서비스입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174128',
            serviceId: '5a9de3d6-283d-4e4c-b4a9-b6b00ddd13bb',
            language: 'zh',
            name: '卡顿/丝绒/兔毛睫毛嫁接',
            description: '我们团队由技术娴熟、经过专业培训的技术人员组成，使用优质产品，确保对眼睛的绝对安全、持久耐用，并适合每种眼型和个人风格。适合喜欢精致、柔和和自然风格的顾客。增加睫毛的厚度和深度 - 创造突出、吸引人的效果。特殊技术打造锐利、迷人的美感 - 不会让眼皮沉重。在自然和突出之间取得平衡 - 适合多种眼型。根据活动、化妆概念和独特眼型提供合适的嫁接风格咨询。为之前做过嫁接或需要完全刷新的顾客提供安全服务。'
          }
        ]
      },
      {
        id: 'f30445fb-16bc-4b43-b716-963f6cd549fb',
        name: 'Nối mi Hybrid',
        description: 'Kết hợp classic và volume',
        duration: 100,
        price: 600000,
        discount: 0,
        coverImage: 'https://example.com/hybrid-eyelash.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174017',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fb',
            language: 'vi',
            name: 'Nối mi Hybrid',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản, sử dụng sản phẩm cao cấp, đảm bảo an toàn tuyệt đối cho mắt, độ bền lâu, và phù hợp với từng kiểu mắt - phong cách cá nhân. Phù hợp cho khách hàng thích phong cách tinh tế, nhẹ nhàng và tự nhiên. Tăng độ dày và sâu cho hàng mi - hiệu ứng nổi bật, thu hút. Kỹ thuật đặc biệt cho vẻ đẹp sắc sảo, quyến rũ - không nặng mí. Cân bằng giữa tự nhiên và nổi bật - phù hợp nhiều dáng mắt. Tư vấn kiểu nối phù hợp với sự kiện, concept makeup, dáng mắt riêng biệt. Dịch vụ an toàn cho những ai đã nối mi trước đó hoặc cần làm mới hoàn toàn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174129',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fb',
            language: 'en',
            name: 'Hybrid Eyelash Extension',
            description: 'Our team of highly skilled technicians, professionally trained, uses premium products to ensure absolute safety for the eyes, long-lasting durability, and suitability for each eye shape and personal style. Combines classic and volume techniques for a perfect balance. Ideal for customers who prefer subtle, gentle and natural styles. Increases the thickness and depth of lashes - creating a standout, attractive effect. Special techniques for sharp, attractive beauty - without heavy eyelids. Balances between natural and prominent - suitable for many eye shapes. Consultation on suitable extension styles for events, makeup concepts, and unique eye shapes. Safe service for those who have had previous extensions or need a complete refresh.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174130',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fb',
            language: 'ko',
            name: '하이브리드 속눈썹 연장',
            description: '고도로 숙련된 기술자 팀은 전문적으로 훈련되어 고품질 제품을 사용하여 눈에 대한 절대적인 안전성, 오래 지속되는 내구성 및 각 눈 모양과 개인 스타일에 적합성을 보장합니다. 클래식과 볼륨 기술을 결합하여 완벽한 균형을 이룹니다. 섬세하고 부드럽고 자연스러운 스타일을 선호하는 고객에게 이상적입니다. 속눈썹의 두께와 깊이를 증가시켜 눈에 띄고 매력적인 효과를 창출합니다. 날카롭고 매력적인 아름다움을 위한 특별한 기술 - 무거운 눈꺼풀 없이. 자연스러움과 두드러짐 사이의 균형 - 다양한 눈 모양에 적합합니다. 이벤트, 메이크업 컨셉 및 독특한 눈 모양에 적합한 연장 스타일에 대한 상담. 이전에 연장을 했거나 완전히 새로고침이 필요한 분들을 위한 안전한 서비스입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174131',
            serviceId: 'f30445fb-16bc-4b43-b716-963f6cd549fb',
            language: 'zh',
            name: '混合型睫毛嫁接',
            description: '我们团队由技术娴熟、经过专业培训的技术人员组成，使用优质产品，确保对眼睛的绝对安全、持久耐用，并适合每种眼型和个人风格。结合经典和浓密技术，达到完美平衡。适合喜欢精致、柔和和自然风格的顾客。增加睫毛的厚度和深度 - 创造突出、吸引人的效果。特殊技术打造锐利、迷人的美感 - 不会让眼皮沉重。在自然和突出之间取得平衡 - 适合多种眼型。根据活动、化妆概念和独特眼型提供合适的嫁接风格咨询。为之前做过嫁接或需要完全刷新的顾客提供安全服务。'
          }
        ]
      },
      {
        id: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b8',
        name: 'Nối mi theo yêu cầu',
        description: 'Custom design',
        duration: 120,
        price: 900000,
        discount: 0,
        coverImage: 'https://example.com/custom-eyelash.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174018',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b8',
            language: 'vi',
            name: 'Nối mi theo yêu cầu',
            description: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản, sử dụng sản phẩm cao cấp, đảm bảo an toàn tuyệt đối cho mắt, độ bền lâu, và phù hợp với từng kiểu mắt - phong cách cá nhân. Phù hợp cho khách hàng thích phong cách tinh tế, nhẹ nhàng và tự nhiên. Tăng độ dày và sâu cho hàng mi - hiệu ứng nổi bật, thu hút. Kỹ thuật đặc biệt cho vẻ đẹp sắc sảo, quyến rũ - không nặng mí. Cân bằng giữa tự nhiên và nổi bật - phù hợp nhiều dáng mắt. Tư vấn kiểu nối phù hợp với sự kiện, concept makeup, dáng mắt riêng biệt. Dịch vụ an toàn cho những ai đã nối mi trước đó hoặc cần làm mới hoàn toàn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174132',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b8',
            language: 'en',
            name: 'Custom Eyelash Extension',
            description: 'Our team of highly skilled technicians, professionally trained, uses premium products to ensure absolute safety for the eyes, long-lasting durability, and suitability for each eye shape and personal style. Fully customized design based on your preferences. Ideal for customers who prefer subtle, gentle and natural styles. Increases the thickness and depth of lashes - creating a standout, attractive effect. Special techniques for sharp, attractive beauty - without heavy eyelids. Balances between natural and prominent - suitable for many eye shapes. Consultation on suitable extension styles for events, makeup concepts, and unique eye shapes. Safe service for those who have had previous extensions or need a complete refresh.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174133',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b8',
            language: 'ko',
            name: '커스텀 속눈썹 연장',
            description: '고도로 숙련된 기술자 팀은 전문적으로 훈련되어 고품질 제품을 사용하여 눈에 대한 절대적인 안전성, 오래 지속되는 내구성 및 각 눈 모양과 개인 스타일에 적합성을 보장합니다. 선호도에 따라 완전히 맞춤 제작된 디자인. 섬세하고 부드럽고 자연스러운 스타일을 선호하는 고객에게 이상적입니다. 속눈썹의 두께와 깊이를 증가시켜 눈에 띄고 매력적인 효과를 창출합니다. 날카롭고 매력적인 아름다움을 위한 특별한 기술 - 무거운 눈꺼풀 없이. 자연스러움과 두드러짐 사이의 균형 - 다양한 눈 모양에 적합합니다. 이벤트, 메이크업 컨셉 및 독특한 눈 모양에 적합한 연장 스타일에 대한 상담. 이전에 연장을 했거나 완전히 새로고침이 필요한 분들을 위한 안전한 서비스입니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174134',
            serviceId: 'fd3ccbec-3a77-4994-b8fc-1b712362e7b8',
            language: 'zh',
            name: '定制睫毛嫁接',
            description: '我们团队由技术娴熟、经过专业培训的技术人员组成，使用优质产品，确保对眼睛的绝对安全、持久耐用，并适合每种眼型和个人风格。根据您的喜好完全定制设计。适合喜欢精致、柔和和自然风格的顾客。增加睫毛的厚度和深度 - 创造突出、吸引人的效果。特殊技术打造锐利、迷人的美感 - 不会让眼皮沉重。在自然和突出之间取得平衡 - 适合多种眼型。根据活动、化妆概念和独特眼型提供合适的嫁接风格咨询。为之前做过嫁接或需要完全刷新的顾客提供安全服务。'
          }
        ]
      },
      {
        id: 'e19a31bc-e30b-4767-9b3f-c10010bcf4ec',
        name: 'Tẩy - gỡ mi cũ - chăm sóc mí & mi yếu',
        description: 'Chăm sóc mí mắt và mi yếu',
        duration: 30,
        price: 200000,
        discount: 0,
        coverImage: 'https://example.com/eyelash-care.jpg',
        categoryId: '88f53d2e-4a89-4060-bd65-594b55dfec2a',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174019',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4ec',
            language: 'vi',
            name: 'Tẩy - gỡ mi cũ - chăm sóc mí & mi yếu',
            description: 'Chúng tôi mang đến dịch vụ nail cao cấp dành cho những khách hàng yêu thích sự chỉn chu, tinh tế và đẳng cấp trong từng chi tiết. Tại không gian riêng tư, sang trọng và đầy thư giãn, bạn sẽ được chăm sóc bởi đội ngũ kỹ thuật viên chuyên nghiệp, tận tâm, có tay nghề cao và gu thẩm mỹ hiện đại. Chúng tôi sử dụng các sản phẩm chính hãng, an toàn cho móng và sức khỏe - từ sơn dưỡng, gel polish đến các dòng chăm sóc móng chuyên biệt. Tất cả được lựa chọn kỹ lưỡng để đảm bảo chất lượng hoàn hảo và độ bền cao.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174135',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4ec',
            language: 'en',
            name: 'Eyelash Removal & Care for Weak Lashes',
            description: 'We provide premium nail services for customers who appreciate meticulous, sophisticated and classy details. In a private, luxurious and relaxing space, you will be cared for by a team of professional, dedicated technicians with high skills and modern aesthetic taste. We use genuine products that are safe for nails and health - from nourishing polish, gel polish to specialized nail care lines. All are carefully selected to ensure perfect quality and high durability.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174136',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4ec',
            language: 'ko',
            name: '속눈썹 제거 및 약한 속눈썹 케어',
            description: '우리는 꼼꼼하고 세련되고 클래시한 디테일을 감상하는 고객을 위한 프리미엄 네일 서비스를 제공합니다. 프라이빗하고 고급스럽고 편안한 공간에서 높은 기술과 현대적인 미적 감각을 가진 전문적이고 헌신적인 기술자 팀의 관리를 받게 됩니다. 우리는 네일과 건강에 안전한 정품 제품을 사용합니다 - 영양 폴리시, 젤 폴리시부터 전문 네일 케어 라인까지. 완벽한 품질과 높은 내구성을 보장하기 위해 모든 제품을 신중하게 선택합니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174137',
            serviceId: 'e19a31bc-e30b-4767-9b3f-c10010bcf4ec',
            language: 'zh',
            name: '睫毛卸除及脆弱睫毛护理',
            description: '我们为欣赏细致、精致和优雅细节的顾客提供优质美甲服务。在一个私密、豪华和放松的空间里，您将受到一支专业、敬业、技术高超且具有现代审美品味的技师团队的照顾。我们使用对指甲和健康安全的正品产品 - 从滋养指甲油、凝胶指甲油到专业指甲护理系列。所有产品都经过精心挑选，以确保完美的品质和高耐久性。'
          }
        ]
      },
      // Nail services
      {
        id: '78a934c3-81c9-4c3a-852a-a9d4d314db77',
        name: 'Cắt da - tạo hình móng - chăm sóc da tay/chân chuyên sâu',
        description: 'Combo chăm sóc móng chuyên sâu',
        duration: 60,
        price: 250000,
        discount: 0,
        coverImage: 'https://example.com/nail-combo.jpg',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
        translations: [
          {
            id: '323e4567-e89b-12d3-a456-426614174020',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db77',
            language: 'vi',
            name: 'Cắt da - tạo hình móng - chăm sóc da tay/chân chuyên sâu',
            description: 'Combo dịch vụ chăm sóc móng toàn diện bao gồm cắt da thừa, tạo hình móng theo yêu cầu và chăm sóc da tay/chân chuyên sâu với các sản phẩm cao cấp. Giúp móng chắc khỏe, da tay/chân mềm mại và trẻ trung hơn.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174138',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db77',
            language: 'en',
            name: 'Cuticle Care - Nail Shaping - Intensive Hand/Foot Care',
            description: 'Comprehensive nail care combo including excess cuticle trimming, custom nail shaping and intensive hand/foot care with premium products. Helps nails become stronger, hands/feet skin softer and more youthful.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174139',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db77',
            language: 'ko',
            name: '큐티클 케어 - 네일 셰이핑 - 집중 핸드/풋 케어',
            description: '과도한 큐티클 정리, 맞춤형 네일 셰이핑 및 고급 제품을 사용한 집중적인 핸드/풋 케어를 포함한 포괄적인 네일 케어 콤보. 손톱을 더 강하게, 손/발 피부를 더 부드럽고 젊어지게 만드는 데 도움을 줍니다.'
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174140',
            serviceId: '78a934c3-81c9-4c3a-852a-a9d4d314db77',
            language: 'zh',
            name: '角质护理 - 指甲塑形 - 深层手部/足部护理',
            description: '全面的指甲护理组合，包括多余角质修剪、定制指甲塑形和使用优质产品的深层手部/足部护理。帮助指甲变得更坚固，手部/足部皮肤更柔软、更年轻。'
          }
        ]
      },
      {
        id: '8b9e4567-e89b-12d3-a456-426614174000',
        name: 'Combo sơn/sơn gel, đắp bột/đắp gel, đính đá nghệ thuật',
        description: 'Combo làm nail đầy đủ',
        duration: 90,
        price: 400000,
        discount: 0,
        coverImage: 'https://example.com/nail-art-combo.jpg',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
        translations: [
          {
            id: '423e4567-e89b-12d3-a456-426614174001',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174000',
            language: 'vi',
            name: 'Combo sơn/sơn gel, đắp bột/đắp gel, đính đá nghệ thuật',
            description: 'Trọn gói dịch vụ làm nail bao gồm sơn thường hoặc sơn gel, đắp bột hoặc đắp gel tùy chọn và đính đá nghệ thuật theo yêu cầu. Mang đến bộ móng hoàn hảo, sang trọng và cá tính.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174101',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174000',
            language: 'en',
            name: 'Combo: Polish/Gel Polish, Powder/Gel Extension, Art Stone Decoration',
            description: 'Complete nail service package including regular polish or gel polish, powder or gel extension option and custom art stone decoration. Delivers perfect, luxurious and personalized nails.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174102',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174000',
            language: 'ko',
            name: '콤보: 폴리시/젤 폴리시, 파우더/젤 연장, 아트 스톤 데코레이션',
            description: '일반 폴리시 또는 젤 폴리시, 파우더 또는 젤 연장 옵션 및 맞춤형 아트 스톤 데코레이션을 포함한 완전한 네일 서비스 패키지. 완벽하고 고급스럽며 개성 있는 네일을 선사합니다.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174103',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174000',
            language: 'zh',
            name: '组合：指甲油/凝胶指甲油，粉/凝胶延长，艺术石装饰',
            description: '完整的指甲服务套餐，包括普通指甲油或凝胶指甲油、粉或凝胶延长选项以及定制艺术石装饰。提供完美、奢华和个性化的指甲。'
          }
        ]
      },
      {
        id: '8b9e4567-e89b-12d3-a456-426614174001',
        name: 'Vẽ móng theo yêu cầu',
        description: 'Nghệ thuật vẽ móng tùy chỉnh',
        duration: 60,
        price: 350000,
        discount: 0,
        coverImage: 'https://example.com/nail-painting.jpg',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
        translations: [
          {
            id: '423e4567-e89b-12d3-a456-426614174002',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174001',
            language: 'vi',
            name: 'Vẽ móng theo yêu cầu',
            description: 'Dịch vụ vẽ móng nghệ thuật theo yêu cầu, từ đơn giản đến phức tạp, được thực hiện bởi các nghệ nhân có tay nghề cao. Mang đến những bộ móng độc đáo, thể hiện cá tính riêng của bạn.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174104',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174001',
            language: 'en',
            name: 'Custom Nail Art',
            description: 'Custom nail art service from simple to complex, performed by skilled artists. Delivers unique nail sets that express your personal style.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174105',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174001',
            language: 'ko',
            name: '맞춤형 네일 아트',
            description: '간단한 것부터 복잡한 것까지 맞춤형 네일 아트 서비스로 숙련된 아티스트가 수행합니다. 개인적인 스타일을 표현하는 독특한 네일 세트를 제공합니다.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174106',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174001',
            language: 'zh',
            name: '定制美甲艺术',
            description: '从简单到复杂的定制美甲艺术服务，由技艺精湛的艺术家完成。提供表达您个人风格的独特美甲套装。'
          }
        ]
      },
      {
        id: '8b9e4567-e89b-12d3-a456-426614174002',
        name: 'Chăm sóc móng',
        description: 'Dịch vụ chăm sóc móng cơ bản',
        duration: 30,
        price: 150000,
        discount: 0,
        coverImage: 'https://example.com/nail-care.jpg',
        categoryId: '90c20b40-f195-4fd7-8ed4-50a7d55d2bef',
        translations: [
          {
            id: '423e4567-e89b-12d3-a456-426614174003',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174002',
            language: 'vi',
            name: 'Chăm sóc móng',
            description: 'Dịch vụ chăm sóc móng cơ bản bao gồm cắt tỉa, dũa móng và chăm sóc da tay/chân. Giúp móng luôn gọn gàng, sạch sẽ và khỏe mạnh.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174107',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174002',
            language: 'en',
            name: 'Basic Nail Care',
            description: 'Basic nail care service including trimming, filing and hand/foot skin care. Keeps nails neat, clean and healthy.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174108',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174002',
            language: 'ko',
            name: '기본 네일 케어',
            description: '다듬기, 줄질 및 핸드/풋 스킨 케어를 포함한 기본 네일 케어 서비스. 손톱을 깔끔하고 청결하며 건강하게 유지합니다.'
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174109',
            serviceId: '8b9e4567-e89b-12d3-a456-426614174002',
            language: 'zh',
            name: '基础指甲护理',
            description: '基本指甲护理服务，包括修剪、锉磨和手部/足部皮肤护理。保持指甲整洁、干净和健康。'
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

    // Insert service details (chuẩn RESTful, có slug và details)
    const detailsData = [
      {
        vi: 'Dịch vụ massage sử dụng tinh dầu thiên nhiên cao cấp, mang đến cho bạn trải nghiệm thư giãn sâu và phục hồi năng lượng tinh thần. Mỗi động tác xoa bóp nhẹ nhàng kết hợp với mùi hương dịu êm giúp giải tỏa áp lực, giảm đau mỏi và cải thiện giấc ngủ. Thích hợp cho những ai đang mệt mỏi, căng thẳng hoặc muốn thưởng cho bản thân một liệu trình chăm sóc toàn diện.',
        en: 'A premium essential oil massage service, bringing you deep relaxation and mental energy recovery. Each gentle massage movement combined with soothing aromas helps relieve stress, reduce aches, and improve sleep. Perfect for those who are tired, stressed, or want to reward themselves with a comprehensive care session.',
        ko: '고급 에센셜 오일을 사용하는 마사지 서비스로 깊은 휴식과 정신 에너지 회복을 선사합니다. 부드러운 마사지 동작과 은은한 향기가 어우러져 스트레스 해소, 통증 완화, 숙면에 도움을 줍니다. 피로하거나 스트레스를 받는 분, 또는 자신에게 포괄적인 케어를 선물하고 싶은 분께 추천합니다.',
        zh: '高端精油按摩服务，为您带来深度放松和精神能量恢复。每一次轻柔的按摩动作结合舒缓的香气，有助于缓解压力、减轻酸痛并改善睡眠。适合疲惫、压力大或想犒赏自己的您。'
      },
      {
        vi: 'Một liệu pháp cổ truyền hàng trăm năm từ Thái Lan, sử dụng kỹ thuật kéo giãn, bấm huyệt và điều chỉnh tư thế giúp cơ thể thả lỏng hoàn toàn. Massage Thái không sử dụng dầu, tập trung vào sự vận động linh hoạt của các nhóm cơ, giúp lưu thông khí huyết, giải phóng năng lượng bị ứ tắc và mang lại cảm giác sảng khoái tức thì. Kéo giãn sâu & bấm huyệt chuẩn Thái',
        en: 'A centuries-old traditional Thai therapy using stretching, acupressure, and posture adjustment to fully relax the body. No oil is used, focusing on flexible muscle movement, improving circulation, and releasing blocked energy. Deep stretching & authentic Thai acupressure.',
        ko: '수백 년 전통의 태국 마사지로, 스트레칭, 지압, 자세 교정을 통해 몸을 완전히 이완시킵니다. 오일을 사용하지 않고 근육의 유연한 움직임에 집중하여 혈액 순환을 돕고 막힌 에너지를 풀어줍니다. 깊은 스트레칭과 정통 태국 지압.',
        zh: '拥有数百年历史的泰式传统疗法，采用拉伸、穴位按压和姿势调整，帮助身体完全放松。不使用精油，注重肌肉灵活运动，促进血液循环，释放阻塞能量。深度拉伸与正宗泰式穴位按摩。'
      },
      {
        vi: 'Đôi chân là nơi tích tụ nhiều căng thẳng và áp lực sau một ngày dài vận động. Massage chân không chỉ giúp giảm đau, thư giãn mà còn kích thích các huyệt đạo liên kết với toàn cơ thể. Với kỹ thuật day ấn chuyên sâu từ bàn chân đến bắp chân, dịch vụ này giúp cải thiện lưu thông máu, giảm sưng mỏi và mang lại cảm giác nhẹ nhàng, dễ chịu đến toàn thân.',
        en: 'Your feet accumulate stress and pressure after a long day. Foot massage not only relieves pain and relaxes but also stimulates acupoints connected to the whole body. With deep pressing techniques from feet to calves, this service improves circulation, reduces swelling, and brings a gentle, pleasant feeling.',
        ko: '하루 종일 쌓인 피로와 압력이 발에 집중됩니다. 발 마사지는 통증 완화와 휴식뿐 아니라 전신과 연결된 경혈을 자극합니다. 발부터 종아리까지 깊은 지압 기술로 혈액 순환을 개선하고 붓기와 피로를 줄여줍니다.',
        zh: '一天的活动后，双脚积累了大量压力。足部按摩不仅有助于缓解疼痛和放松，还能刺激与全身相连的穴位。通过从脚到小腿的深度按压技术，改善血液循环，减轻肿胀和疲劳，带来轻松愉快的感觉。'
      },
      // ... tiếp tục cho các dịch vụ còn lại, mỗi dịch vụ 1 object 4 ngôn ngữ ...
    ];
    // Gán details cho từng service
    services.forEach((service: any, idx: number) => {
      service.details = [
        {
          title: service.name + ' - Quy trình',
          description: detailsData[idx]?.vi || service.description || 'Quy trình dịch vụ chi tiết',
          content: detailsData[idx]?.vi || service.description || 'Quy trình dịch vụ chi tiết',
          language: 'vi',
          serviceId: service.id
        },
        {
          title: service.name + ' - Procedure',
          description: detailsData[idx]?.en || service.description || 'Service procedure details',
          content: detailsData[idx]?.en || service.description || 'Service procedure details',
          language: 'en',
          serviceId: service.id
        },
        {
          title: service.name + ' - 절차',
          description: detailsData[idx]?.ko || service.description || '서비스 절차 상세',
          content: detailsData[idx]?.ko || service.description || '서비스 절차 상세',
          language: 'ko',
          serviceId: service.id
        },
        {
          title: service.name + ' - 流程',
          description: detailsData[idx]?.zh || service.description || '服务流程详情',
          content: detailsData[idx]?.zh || service.description || '服务流程详情',
          language: 'zh',
          serviceId: service.id
        }
      ];
    });
    // Insert vào bảng services_details
    for (const service of services) {
      const s = service as any;
      for (const detail of s.details) {
        await queryRunner.query(`
          INSERT INTO "services_details" ("id", "serviceId", "title", "description", "content", "language", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        `, [detail.serviceId, detail.title, detail.description, detail.content, detail.language]);
      }
    }

    // Insert slides
    const slides = [
      {
        id: '1e1a1e1a-0000-0000-0000-000000000201',
        image: 'https://pub-07c795eeb50b4741906df9234c81ee65.r2.dev/home-background.jpeg',
        role: SlideRole.HOME,
        order: 1,
        translations: [
          {
            id: '1e1a1e1a-0000-0000-0000-000000000211',
            slideId: '1e1a1e1a-0000-0000-0000-000000000201',
            language: 'vi',
            title: 'Chào mừng đến với massge home24h',
            description: 'Dịch vụ massage cao cấp 24/7 tốt nhất'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000212',
            slideId: '1e1a1e1a-0000-0000-0000-000000000201',
            language: 'en',
            title: 'Welcome to Massage Home24h',
            description: 'The best premium 24/7 massage service'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000213',
            slideId: '1e1a1e1a-0000-0000-0000-000000000201',
            language: 'ko',
            title: '마사지 홈24h에 오신 것을 환영합니다',
            description: '최고의 프리미엄 24/7 마사지 서비스'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000214',
            slideId: '1e1a1e1a-0000-0000-0000-000000000201',
            language: 'zh',
            title: '欢迎来到 Massage Home24h',
            description: '最优质的24/7按摩服务'
          }
        ]
      },
      {
        id: '1e1a1e1a-0000-0000-0000-000000000202',
        image: 'https://pub-07c795eeb50b4741906df9234c81ee65.r2.dev/MassageTherapyFAQs-FloridaAcademy.jpeg',
        role: SlideRole.HOME,
        order: 2,
        translations: [
          {
            id: '1e1a1e1a-0000-0000-0000-000000000221',
            slideId: '1e1a1e1a-0000-0000-0000-000000000202',
            language: 'vi',
            title: 'Massage thái cổ truyền',
            description: 'Dịch vụ massage cao cấp 24/7 tốt nhất'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000222',
            slideId: '1e1a1e1a-0000-0000-0000-000000000202',
            language: 'en',
            title: 'Traditional Thai Massage',
            description: 'The best premium 24/7 massage service'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000223',
            slideId: '1e1a1e1a-0000-0000-0000-000000000202',
            language: 'ko',
            title: '전통 태국 마사지',
            description: '최고의 프리미엄 24/7 마사지 서비스'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000224',
            slideId: '1e1a1e1a-0000-0000-0000-000000000202',
            language: 'zh',
            title: '传统泰式按摩',
            description: '最优质的24/7按摩服务'
          }
        ]
      },
      {
        id: '1e1a1e1a-0000-0000-0000-000000000203',
        image: 'https://pub-07c795eeb50b4741906df9234c81ee65.r2.dev/a4c737a39f914382a4e9a7e788053328.jpg',
        role: SlideRole.HOME,
        order: 3,
        translations: [
          {
            id: '1e1a1e1a-0000-0000-0000-000000000231',
            slideId: '1e1a1e1a-0000-0000-0000-000000000203',
            language: 'vi',
            title: 'Massage chân tốt nhất',
            description: 'Massage Home24h mang đến trải nghiệm tốt nhất cho bạn'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000232',
            slideId: '1e1a1e1a-0000-0000-0000-000000000203',
            language: 'en',
            title: 'Best Foot Massage',
            description: 'Massage Home24h brings you the best experience'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000233',
            slideId: '1e1a1e1a-0000-0000-0000-000000000203',
            language: 'ko',
            title: '최고의 발 마사지',
            description: 'Massage Home24h가 최고의 경험을 선사합니다'
          },
          {
            id: '1e1a1e1a-0000-0000-0000-000000000234',
            slideId: '1e1a1e1a-0000-0000-0000-000000000203',
            language: 'zh',
            title: '最佳足部按摩',
            description: 'Massage Home24h为您带来最佳体验'
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
    await queryRunner.query(`DELETE FROM "service_translations"`);
    await queryRunner.query(`DELETE FROM "services"`);
    await queryRunner.query(`DELETE FROM "category_translations"`);
    await queryRunner.query(`DELETE FROM "categories"`);
    await queryRunner.query(`DELETE FROM "slide_translations"`);
    await queryRunner.query(`DELETE FROM "slides"`);
  }
}