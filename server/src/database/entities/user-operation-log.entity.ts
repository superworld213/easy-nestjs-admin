import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_operation_log')
export class UserOperationLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 20 })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  router: string;

  @Column({ type: 'varchar', length: 80 })
  service_name: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark?: string | null;
}
