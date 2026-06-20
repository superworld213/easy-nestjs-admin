import { Entity, PrimaryColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('user_position')
export class UserPositionEntity extends SoftDeleteColumns {
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;

  @PrimaryColumn({ type: 'bigint' })
  position_id: number;
}
