import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PageList, UserLoginLog, UserOperationLog } from '../../common/types/entities';
import { UserLoginLogEntity } from '../../database/entities/user-login-log.entity';
import { UserOperationLogEntity } from '../../database/entities/user-operation-log.entity';

type ResourceQuery = Record<string, unknown>;

@Injectable()
export class LogstashService {
  constructor(
    @InjectRepository(UserLoginLogEntity)
    private readonly loginLogRepo: Repository<UserLoginLogEntity>,
    @InjectRepository(UserOperationLogEntity)
    private readonly operationLogRepo: Repository<UserOperationLogEntity>,
  ) {}

  async pageLoginLogs(query: ResourceQuery): Promise<PageList<UserLoginLog>> {
    const qb = this.loginLogRepo.createQueryBuilder('log');
    this.andLike(qb, 'log.username', query.username);
    this.andLike(qb, 'log.ip', query.ip);
    this.andLike(qb, 'log.os', query.os);
    this.andLike(qb, 'log.browser', query.browser);
    if (query.status !== undefined && query.status !== '') {
      qb.andWhere('log.status = :status', { status: Number(query.status) });
    }
    qb.orderBy('log.id', 'DESC');
    const [list, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    return { list: list as unknown as UserLoginLog[], total };
  }

  async deleteLoginLogs(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length > 0) {
      await this.loginLogRepo.delete(ids);
    }
  }

  async pageOperationLogs(query: ResourceQuery): Promise<PageList<UserOperationLog>> {
    const qb = this.operationLogRepo.createQueryBuilder('log');
    this.andLike(qb, 'log.username', query.username);
    this.andLike(qb, 'log.method', query.method);
    this.andLike(qb, 'log.router', query.router);
    this.andLike(qb, 'log.service_name', query.service_name);
    this.andLike(qb, 'log.ip', query.ip);
    qb.orderBy('log.id', 'DESC');
    const [list, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    return { list: list as UserOperationLog[], total };
  }

  async deleteOperationLogs(body: unknown): Promise<void> {
    const ids = this.normalizeIds(body);
    if (ids.length > 0) {
      await this.operationLogRepo.delete({ id: In(ids) });
    }
  }

  async recordOperation(input: {
    username: string;
    method: string;
    router: string;
    serviceName: string;
    ip?: string | null;
    remark?: string | null;
  }): Promise<void> {
    await this.operationLogRepo.save(
      this.operationLogRepo.create({
        username: this.truncate(input.username || 'unknown', 20),
        method: this.truncate(input.method, 20),
        router: this.truncate(input.router, 500),
        service_name: this.truncate(input.serviceName, 80),
        ip: this.truncate(input.ip ?? '', 45),
        remark: this.truncate(input.remark ?? '', 255),
      }),
    );
  }

  private normalizeIds(input: unknown): number[] {
    if (Array.isArray(input)) {
      return input.map(Number).filter(Number.isFinite);
    }

    if (typeof input === 'object' && input !== null) {
      const body = input as Record<string, unknown>;
      if (Array.isArray(body.ids)) {
        return body.ids.map(Number).filter(Number.isFinite);
      }
      if (body.id !== undefined) {
        return [Number(body.id)].filter(Number.isFinite);
      }
    }

    return [];
  }

  private skip(query: ResourceQuery): number {
    const page = Number(query.page ?? 1);
    return (Number.isFinite(page) && page > 0 ? page - 1 : 0) * this.take(query);
  }

  private take(query: ResourceQuery): number {
    const pageSize = Number(query.page_size ?? query.per_page ?? 10);
    return Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  }

  private andLike(qb: { andWhere: (condition: string, params?: Record<string, unknown>) => unknown }, column: string, value: unknown): void {
    if (value !== undefined && value !== null && value !== '') {
      const key = column.replace(/\W/g, '_');
      qb.andWhere(`${column} LIKE :${key}`, { [key]: `%${String(value)}%` });
    }
  }

  private truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? value.slice(0, maxLength) : value;
  }
}
