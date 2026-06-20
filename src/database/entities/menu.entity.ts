import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { AuditColumns } from './base-columns';

@Entity('menu')
export class MenuEntity extends AuditColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: 0 })
  parent_id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, default: '' })
  name: string;

  @Column({ type: 'json', nullable: true })
  meta?: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 60, default: '' })
  path: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  component: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  redirect: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'smallint', default: 0 })
  sort: number;
}
