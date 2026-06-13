import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', default: 0 })
  parent_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  component: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  redirect: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  path: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;

  @Column({ type: 'smallint', default: 0 })
  sort: number;

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

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];
}
