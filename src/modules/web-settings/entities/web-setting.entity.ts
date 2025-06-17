import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_settings')
export class WebSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  siteName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  workingHours: string;

  @Column({ type: 'text', nullable: true })
  googleMap: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  messenger: string;

  @Column({ nullable: true })
  zalo: string;

  @Column({ nullable: true })
  wechat: string;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  line: string;

  @Column({ nullable: true })
  kakaotalk: string;
}
