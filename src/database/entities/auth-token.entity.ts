import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { TimestampColumns } from './base-columns';

export type AuthTokenType = 'access' | 'refresh';

@Entity('auth_token')
export class AuthTokenEntity extends TimestampColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'bigint' })
  user_id: number;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  session_id: string;

  @Index({ unique: true })
  @Column({ type: 'char', length: 64 })
  token_hash: string;

  @Column({ type: 'varchar', length: 20 })
  token_type: AuthTokenType;

  @Index()
  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  revoked_at?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  last_used_at?: Date | null;

  @Column({ type: 'varchar', length: 255, default: '' })
  remark: string;
}
