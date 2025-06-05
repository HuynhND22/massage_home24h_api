import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SlideTranslation } from './slide-translation.entity';

export enum SlideRole {
  HOME = 'home',
  BLOG = 'blog'
}

@Entity('slides')
export class Slide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'enum', enum: SlideRole })
  role: SlideRole;

  @Column({ type: 'int' })
  order: number;

  @OneToMany(() => SlideTranslation, translation => translation.slide)
  translations: SlideTranslation[];
}
