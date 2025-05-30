import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Service } from '../../services/entities/service.entity';

export enum CategoryType {
  BLOG = 'blog',
  SERVICE = 'service',
}

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({ nullable: true })
  coverImage: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
