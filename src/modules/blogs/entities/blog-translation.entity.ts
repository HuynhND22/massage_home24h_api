import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Blog } from './blog.entity';

@Entity('blog_translations')
export class BlogTranslation extends BaseEntity {
  @Column()
  blogId: string;

  @Column()
  language: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;
}
