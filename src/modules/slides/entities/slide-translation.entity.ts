import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Slide } from './slide.entity';

@Entity('slide_translations')
export class SlideTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'uuid' })
  slideId: string;

  @Column({ type: 'varchar' })
  language: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => Slide, slide => slide.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slideId' })
  slide: Slide;
} 