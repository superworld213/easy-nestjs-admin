import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('position')
export class PositionEntity extends SoftDeleteColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'bigint' })
  dept_id: number;
}
