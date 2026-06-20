import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { AuditColumns } from './base-columns';

@Entity('user')
export class AdminUserEntity extends AuditColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 3, default: '100' })
  user_type: string;

  @Column({ type: 'varchar', length: 30, default: '' })
  nickname: string;

  @Column({ type: 'varchar', length: 11, default: '' })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  avatar: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  signed: string;

  @Column({ type: 'tinyint', default: 1 })
  status: 1 | 2;

  @Column({ type: 'varchar', length: 45, default: '127.0.0.1' })
  login_ip: string;

  @Column({ type: 'datetime', nullable: true })
  login_time?: Date;

  @Column({ type: 'json', nullable: true })
  backend_setting?: Record<string, unknown> | null;
}
