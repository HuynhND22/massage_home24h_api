import { Column, Entity, OneToMany, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { CategoryTranslation } from './category-translation.entity';

export enum CategoryType {
  SERVICE = 'service',
  BLOG = 'blog'
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType;

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  slug: string;

  @OneToMany(() => CategoryTranslation, translation => translation.category)
  translations: CategoryTranslation[];
}
