import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_belongs_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint' })
  role_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date;
}
