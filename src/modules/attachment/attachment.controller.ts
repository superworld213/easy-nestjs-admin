import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission } from '../../common/decorators/permission.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AdminUser, Attachment, PageList } from '../../common/types/entities';
import { AttachmentService } from './attachment.service';

@ApiBearerAuth()
@ApiTags('admin:attachment')
@Controller('admin/attachment')
export class AttachmentController {
  constructor(private readonly service: AttachmentService) {}

  @Get('list')
  @Permission('dataCenter:attachment:list')
  list(@Query() query: PaginationQueryDto): Promise<PageList<Attachment>> {
    return this.service.page(query);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Permission('dataCenter:attachment:upload')
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: AdminUser): Promise<Attachment> {
    return this.service.upload(file, user.id);
  }

  @Delete(':id')
  @Permission('dataCenter:attachment:delete')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<[]> {
    await this.service.delete(id);
    return [];
  }
}
