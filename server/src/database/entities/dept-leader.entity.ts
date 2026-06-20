import { Entity, PrimaryColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('dept_leader')
export class DeptLeaderEntity extends SoftDeleteColumns {
  @PrimaryColumn({ type: 'bigint' })
  dept_id: number;

  @PrimaryColumn({ type: 'bigint' })
  user_id: number;
}
