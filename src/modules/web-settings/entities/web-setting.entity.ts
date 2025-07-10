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
  messengerQr: string;

  @Column({ nullable: true })
  zalo: string;

  @Column({ nullable: true })
  zaloQr: string;

  @Column({ nullable: true })
  wechat: string;

  @Column({ nullable: true })
  wechatQr: string;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  telegramQr: string;

  @Column({ nullable: true })
  line: string;

  @Column({ nullable: true })
  lineQr: string;

  @Column({ nullable: true })
  kakaotalk: string;

  @Column({ nullable: true })
  kakaotalkQr: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  whatsappQr: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  instagramQr: string;
}
