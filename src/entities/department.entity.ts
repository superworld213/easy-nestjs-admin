import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Position } from './position.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'bigint', default: 0 })
  parent_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToMany(() => User, (user) => user.departments)
  department_users: User[];

  @ManyToMany(() => User, (user) => user.dept_leader)
  leaders: User[];

  @OneToMany(() => Position, (pos) => pos.department)
  positions: Position[];
}
