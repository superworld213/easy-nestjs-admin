import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('role_belongs_menu')
export class RoleMenuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  role_id: number;

  @Column({ type: 'bigint' })
  menu_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date;
}
