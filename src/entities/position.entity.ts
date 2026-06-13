import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { DataPermissionPolicy } from './data-permission-policy.entity';

@Entity('position')
export class Position {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'bigint' })
  dept_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Department, (dept) => dept.positions)
  @JoinColumn({ name: 'dept_id' })
  department: Department;

  @ManyToMany(() => User, (user) => user.positions)
  users: User[];

  @OneToOne(() => DataPermissionPolicy, (policy) => policy.position)
  policy: DataPermissionPolicy;
}
