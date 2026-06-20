import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { AuditColumns } from './base-columns';

@Entity('attachment')
export class AttachmentEntity extends AuditColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20, default: 'local' })
  storage_mode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  origin_name?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  object_name?: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  hash?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mime_type?: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  storage_path?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  suffix?: string | null;

  @Column({ type: 'bigint', nullable: true })
  size_byte?: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size_info?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url?: string | null;
}
