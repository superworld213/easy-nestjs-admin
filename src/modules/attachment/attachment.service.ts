import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Repository } from 'typeorm';

import { Attachment, PageList } from '../../common/types/entities';
import { AttachmentEntity } from '../../database/entities/attachment.entity';

type ResourceQuery = Record<string, unknown>;

@Injectable()
export class AttachmentService {
  private readonly uploadRoot = resolve(__dirname, '..', '..', '..', process.env.UPLOAD_DIR ?? '../storage/uploads');
  private readonly maxUploadBytes = Number(process.env.UPLOAD_MAX_BYTES ?? 20 * 1024 * 1024);
  private readonly publicBaseUrl = (process.env.UPLOAD_PUBLIC_BASE_URL ?? `http://127.0.0.1:${process.env.PORT ?? 9502}`).replace(/\/$/, '');

  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepo: Repository<AttachmentEntity>,
  ) {}

  async page(query: ResourceQuery): Promise<PageList<Attachment>> {
    const qb = this.attachmentRepo.createQueryBuilder('attachment');
    this.andLike(qb, 'attachment.storage_mode', query.storage_mode);
    this.andLike(qb, 'attachment.origin_name', query.origin_name);
    this.andLike(qb, 'attachment.mime_type', query.mime_type);
    if (query.suffix !== undefined && query.suffix !== '') {
      const suffixes = String(query.suffix)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      if (suffixes.length > 0) {
        qb.andWhere('attachment.suffix IN (:...suffixes)', { suffixes });
      }
    }

    qb.orderBy('attachment.id', 'DESC');
    const [list, total] = await qb.skip(this.skip(query)).take(this.take(query)).getManyAndCount();
    return { list: list as Attachment[], total };
  }

  async upload(file: Express.Multer.File | undefined, currentUserId: number): Promise<Attachment> {
    if (!file) {
      throw new BadRequestException('Upload file is required');
    }
    if (!file.buffer) {
      throw new BadRequestException('Upload file buffer is required');
    }
    if (file.size > this.maxUploadBytes) {
      throw new BadRequestException(`Upload file must be smaller than ${this.formatSize(this.maxUploadBytes)}`);
    }

    const objectHash = this.hashFileName(file.originalname, file.size);
    const suffix = this.resolveSuffix(file.originalname);
    const objectName = `${objectHash}${suffix ? `.${suffix}` : ''}`;
    const filePath = join(this.uploadRoot, objectName);

    await mkdir(this.uploadRoot, { recursive: true });
    await writeFile(filePath, file.buffer);

    let attachment: AttachmentEntity;
    try {
      attachment = await this.attachmentRepo.save(
        this.attachmentRepo.create({
          storage_mode: 'local',
          origin_name: file.originalname,
          object_name: objectName,
          hash: objectHash,
          mime_type: file.mimetype,
          storage_path: '/uploads',
          suffix,
          size_byte: file.size,
          size_info: this.formatSize(file.size),
          url: `${this.publicBaseUrl}/uploads/${objectName}`,
          created_by: currentUserId,
          updated_by: currentUserId,
        }),
      );
    } catch (error) {
      await this.safeUnlink(filePath);
      throw error;
    }

    return attachment as Attachment;
  }

  async delete(id: number): Promise<void> {
    const attachment = await this.attachmentRepo.findOneBy({ id });
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const result = await this.attachmentRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Attachment not found');
    }
    if (attachment.object_name) {
      await this.safeUnlink(join(this.uploadRoot, attachment.object_name));
    }
  }

  private hashFileName(name: string, size = 0): string {
    return createHash('sha1').update(`${name}:${size}:${Date.now()}`).digest('hex');
  }

  private resolveSuffix(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? String(parts.pop()).toLowerCase() : '';
  }

  private formatSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
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

  private async safeUnlink(path: string): Promise<void> {
    await unlink(path).catch(() => undefined);
  }
}
