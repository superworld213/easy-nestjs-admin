import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditColumns {
  @Column({ name: 'created_by', type: 'bigint', default: 0 })
  created_by: number;

  @Column({ name: 'updated_by', type: 'bigint', default: 0 })
  updated_by: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 255, default: '' })
  remark: string;
}

export abstract class TimestampColumns {
  @CreateDateColumn({ name: 'created_at', type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date;
}

export abstract class SoftDeleteColumns extends TimestampColumns {
  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deleted_at?: Date | null;
}
