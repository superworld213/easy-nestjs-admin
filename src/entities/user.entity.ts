import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { Department } from './department.entity';
import { Position } from './position.entity';
import { DataPermissionPolicy } from './data-permission-policy.entity';

export enum UserStatus {
  NORMAL = 1,
  DISABLE = 2,
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @Column({ type: 'varchar', length: 3, default: '100' })
  user_type: string;

  @Column({ type: 'varchar', length: 30, default: '' })
  nickname: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  avatar: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  signed: string;

  @Column({ type: 'tinyint', default: UserStatus.NORMAL })
  status: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  login_ip: string;

  @Column({ type: 'datetime', nullable: true })
  login_time: Date;

  @Column({ type: 'json', nullable: true })
  backend_setting: Record<string, any>;

  @Column({ type: 'bigint', nullable: true })
  created_by: number;

  @Column({ type: 'bigint', nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, default: '' })
  remark: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_belongs_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ManyToMany(() => Department, (dept) => dept.department_users)
  @JoinTable({
    name: 'user_dept',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'dept_id' },
  })
  departments: Department[];

  @ManyToMany(() => Department, (dept) => dept.leaders)
  @JoinTable({
    name: 'dept_leader',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'dept_id' },
  })
  dept_leader: Department[];

  @ManyToMany(() => Position, (pos) => pos.users)
  @JoinTable({
    name: 'user_position',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'position_id' },
  })
  positions: Position[];

  @OneToMany(() => DataPermissionPolicy, (policy) => policy.user)
  policies: DataPermissionPolicy[];
}
