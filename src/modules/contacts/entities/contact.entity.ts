import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('contacts')
export class Contact extends BaseEntity {
  @Column()
  name: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  order: number;
}
