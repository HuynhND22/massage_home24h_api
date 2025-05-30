import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum SlideRole {
  HOME = 'home',
  ABOUT = 'about',
  SERVICE = 'service',
}

@Entity('slides')
export class Slide extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: SlideRole,
    default: SlideRole.HOME,
  })
  role: SlideRole;

  @Column({ default: 0 })
  order: number;
}
