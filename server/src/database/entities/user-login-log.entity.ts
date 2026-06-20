import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_login_log')
export class UserLoginLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  os?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  browser?: string | null;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  message?: string | null;

  @Column({ type: 'datetime' })
  login_time: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark?: string | null;
}
