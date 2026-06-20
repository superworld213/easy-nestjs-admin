import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { AuditColumns } from './base-columns';

@Entity('role')
export class RoleEntity extends AuditColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'smallint', default: 0 })
  sort: number;
}
