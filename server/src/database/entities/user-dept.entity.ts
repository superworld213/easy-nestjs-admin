import { Column, Entity, PrimaryColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('user_dept')
export class UserDeptEntity extends SoftDeleteColumns {
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;

  @PrimaryColumn({ type: 'bigint' })
  dept_id: number;
}
