import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Position } from './position.entity';

export enum PolicyType {
  ALL = 'ALL',
  SELF = 'SELF',
  DEPT_SELF = 'DEPT_SELF',
  DEPT_TREE = 'DEPT_TREE',
  CUSTOM_DEPT = 'CUSTOM_DEPT',
  CUSTOM_FUNC = 'CUSTOM_FUNC',
}

@Entity('data_permission_policy')
export class DataPermissionPolicy {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  user_id: number;

  @Column({ type: 'bigint', nullable: true })
  position_id: number;

  @Column({ type: 'varchar', length: 50 })
  policy_type: string;

  @Column({ type: 'boolean', default: true })
  is_default: boolean;

  @Column({ type: 'json', nullable: true })
  value: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.policies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Position, (pos) => pos.policy)
  @JoinColumn({ name: 'position_id' })
  position: Position;
}
