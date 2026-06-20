import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('data_permission_policy')
export class DataPermissionPolicyEntity extends SoftDeleteColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: 0 })
  user_id: number;

  @Column({ type: 'bigint', default: 0 })
  position_id: number;

  @Column({ type: 'varchar', length: 20 })
  policy_type: string;

  @Column({ type: 'boolean', default: true })
  is_default: boolean;

  @Column({ type: 'json', nullable: true })
  value?: unknown;
}
