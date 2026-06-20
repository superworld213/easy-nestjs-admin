import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
})
export class AttachmentModule {}
