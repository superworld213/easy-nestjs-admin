import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { SoftDeleteColumns } from './base-columns';

@Entity('department')
export class DepartmentEntity extends SoftDeleteColumns {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'bigint', default: 0 })
  parent_id: number;
}
