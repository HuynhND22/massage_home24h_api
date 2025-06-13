import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ServiceTranslation } from './service-translation.entity';
import { ServiceDetail } from './service-detail.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category)
  category: Category;

  @OneToMany(() => ServiceTranslation, translation => translation.service)
  translations: ServiceTranslation[];

  @OneToMany(() => ServiceDetail, detail => detail.service)
  details: ServiceDetail[];
}
