import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { Service } from '../services/entities/service.entity';
import { ServiceTranslation } from '../services/entities/service-translation.entity';
import { ServiceDetail } from '../services/entities/service-detail.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { BlogTranslation } from '../blogs/entities/blog-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      CategoryTranslation,
      Service,
      ServiceTranslation,
      ServiceDetail,
      Blog,
      BlogTranslation,
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
