import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { BlogTranslation } from './blog-translation.entity';

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => BlogTranslation, (translation) => translation.blog, {
    cascade: true,
  })
  translations: BlogTranslation[];

  @Column({ default: 0 })
  viewCount: number;
}
